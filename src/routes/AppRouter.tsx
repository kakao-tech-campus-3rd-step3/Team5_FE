import { useEffect, useState } from 'react';

import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import { extractTokensFromResponse, refreshAccessToken } from '../api/auth';
import ArchivePage from '../pages/Archive/Archive';
import FeedbackPage from '../pages/Feedback/Feedback';
import FeedbackDetailPage from '../pages/FeedbackDetail/FeedbackDetail';
import HomePage from '../pages/Home/Home';
import JobSelectionPage from '../pages/JobSelection/JobSelection';
import LoginPage from '../pages/Login/Login';
import OauthRedirectPage from '../pages/Login/OauthRedirectPage';
import MyPage from '../pages/MyPage/MyPage';
import NotFound from '../pages/NotFound/NotFound';
import RivalPage from '../pages/Rival/Rival';
import RivalDetail from '../pages/Rival/RivalDetail';
import SelectWorkPage from '../pages/SelectWork/SelectWork';
import SubscribePage from '../pages/Subscribe/Subscribe';
import AuthLayout from '../shared/layouts/AuthLayout';
import MainLayout from '../shared/layouts/MainLayout';
import ModalLayout from '../shared/layouts/ModalLayout';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../shared/utils/auth';

import ProtectedRoute from './ProtectedRoute';
import { ROUTE_PATH } from './routePath';

const AppRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 토큰 갱신 함수
  const tryRefreshToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      console.warn('⚠️ [AppRouter] 리프레시 토큰이 없습니다.');
      return false;
    }

    try {
      console.log('🔄 [AppRouter] 토큰 갱신 시도...');
      const response = await refreshAccessToken(refreshToken);

      // extractTokensFromResponse 함수를 사용하여 일관된 방식으로 토큰 추출
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        extractTokensFromResponse(response);

      if (newAccessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        // 리프레시 토큰이 새로 발급된 경우에만 업데이트
        if (newRefreshToken && newRefreshToken !== refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
          console.log('✅ [AppRouter] 액세스 토큰 및 리프레시 토큰 갱신 완료');
        } else {
          console.log('✅ [AppRouter] 액세스 토큰 갱신 완료 (리프레시 토큰 유지)');
        }
        setIsAuthenticated(true);
        return true;
      } else {
        console.error('❌ [AppRouter] 토큰 갱신 실패: 새로운 액세스 토큰이 없습니다.', {
          responseKeys: Object.keys(response),
          responsePreview: JSON.stringify(response).substring(0, 100),
        });
        throw new Error('토큰 갱신 실패: 새로운 액세스 토큰이 없습니다.');
      }
    } catch (error) {
      console.error('❌ [AppRouter] 토큰 갱신 실패:', error);
      // 갱신 실패 시 토큰 삭제
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setIsAuthenticated(false);
      return false;
    }
  };

  // 인증 상태 확인 및 자동 갱신
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);

      // URL 파라미터에서 토큰이 있으면 즉시 파싱 및 저장 (OAuth 리다이렉트)
      // window.location.search를 직접 사용하여 잘못된 URL 형식도 처리
      const searchParams = window.location.search;
      const urlParams = new URLSearchParams(searchParams);
      const tokenFromUrl = urlParams.get('token') || urlParams.get('accessToken');
      const refreshTokenFromUrl = urlParams.get('refreshToken') || urlParams.get('refresh_token');

      if (tokenFromUrl) {
        console.log('✅ [OAuth 리다이렉트] 토큰 발견:', {
          tokenPreview: tokenFromUrl.substring(0, 20) + '...',
          hasRefreshToken: !!refreshTokenFromUrl,
          currentUrl: window.location.href,
          searchParams: searchParams,
        });

        // 토큰 즉시 저장
        localStorage.setItem(ACCESS_TOKEN_KEY, tokenFromUrl);
        if (refreshTokenFromUrl) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenFromUrl);
        }

        // URL에서 토큰 파라미터 제거 (보안)
        // window.location.href가 잘못된 형식일 수 있으므로 안전하게 처리
        try {
          const currentUrl = window.location.href;
          // 잘못된 URL 형식 (localhost:?token=...) 감지 및 수정
          if (currentUrl.includes('localhost:?') || currentUrl.includes('://?')) {
            console.warn('⚠️ [OAuth 리다이렉트] 잘못된 URL 형식 감지, 수정 중...', currentUrl);
            // 현재 origin과 pathname을 사용하여 올바른 URL 생성
            const cleanUrl = `${window.location.origin}${window.location.pathname}`;
            window.history.replaceState({}, '', cleanUrl);
          } else {
            // 정상적인 URL 형식인 경우에만 URL 객체 사용
            const newUrl = new URL(currentUrl);
            newUrl.searchParams.delete('token');
            newUrl.searchParams.delete('accessToken');
            newUrl.searchParams.delete('refreshToken');
            newUrl.searchParams.delete('refresh_token');
            window.history.replaceState({}, '', newUrl.toString());
          }
        } catch (urlError) {
          // URL 파싱 실패 시 간단하게 pathname만 사용
          console.warn('⚠️ [OAuth 리다이렉트] URL 파싱 실패, 기본 경로로 이동:', urlError);
          window.history.replaceState({}, '', window.location.pathname);
        }

        // 인증 상태 업데이트 및 홈으로 이동
        setIsAuthenticated(true);
        setIsCheckingAuth(false);

        // 홈이 아닌 경우에만 이동
        if (location.pathname !== ROUTE_PATH.HOME) {
          navigate(ROUTE_PATH.SELECT_WORK, { replace: true });
        }
        return;
      }

      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const isPublicRoute =
        location.pathname === ROUTE_PATH.LOGIN ||
        location.pathname === '/login/oauth' ||
        location.pathname === ROUTE_PATH.NOTFOUND;

      // 공개 경로는 인증 확인 불필요
      if (isPublicRoute) {
        setIsCheckingAuth(false);
        // 로그인 페이지에서 토큰이 있으면 인증 상태 업데이트 (다른 탭에서 로그인한 경우 대비)
        if (accessToken) {
          setIsAuthenticated(true);
        }
        return;
      }

      // 액세스 토큰이 있으면 인증 상태 업데이트
      if (accessToken) {
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        return;
      }

      // 액세스 토큰이 없으면 리프레시 토큰으로 갱신 시도
      const refreshed = await tryRefreshToken();

      if (!refreshed && !isPublicRoute) {
        // 갱신 실패 시 로그인 페이지로 리다이렉트
        navigate(ROUTE_PATH.LOGIN, { replace: true });
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [location.pathname, navigate]);

  // localStorage 변경 감지 (같은 탭에서 토큰이 변경된 경우)
  useEffect(() => {
    const handleStorageChange = () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (accessToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    // storage 이벤트는 다른 탭에서만 발생하므로, 직접 체크하는 interval 추가
    const interval = setInterval(() => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const currentAuthState = !!accessToken;
      if (currentAuthState !== isAuthenticated) {
        setIsAuthenticated(currentAuthState);
      }
    }, 1000); // 1초마다 체크

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // apiClient 인터셉터에서 401 에러를 자동으로 처리하므로 여기서는 추가 처리 불필요

  // 로딩 중일 때는 간단한 로딩 화면 표시
  if (isCheckingAuth) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '16px',
          fontSize: '14px',
          color: '#666',
        }}
      >
        <div>로그인 처리 중...</div>
      </div>
    );
  }
  return (
    <Routes>
      <Route element={<ProtectedRoute isAuth={isAuthenticated} />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTE_PATH.HOME} element={<HomePage />} />
          <Route path={ROUTE_PATH.ARCHIVE} element={<ArchivePage />} />
          <Route path={ROUTE_PATH.SUBSCRIBE} element={<SubscribePage />} />
          {/* <Route path={ROUTE_PATH.FEEDBACK} element={<FeedbackPage />} /> */}
          <Route path={ROUTE_PATH.RIVAL} element={<RivalPage />} />
          <Route path={ROUTE_PATH.RIVAL_DETAIL} element={<RivalDetail />} />
          <Route path={ROUTE_PATH.MYPAGE} element={<MyPage />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        {/* TODO: LOGINPAGE 등 네비, 푸터 없이 콘텐츠만 보여줘야 하는 레이아웃 추가 */}
        <Route path={ROUTE_PATH.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_PATH.SELECT_WORK} element={<SelectWorkPage />} />
        <Route path={ROUTE_PATH.JOBSELECT} element={<JobSelectionPage />} />
      </Route>
      <Route path={ROUTE_PATH.LOGIN_OAUTH} element={<OauthRedirectPage />} />

      <Route element={<ModalLayout />}>
        <Route path={ROUTE_PATH.FEEDBACK} element={<FeedbackPage />} />
        {/* <Route path={ROUTE_PATH.FEEDBACK} element={<FeedbackPage />} /> */}
        <Route path={ROUTE_PATH.FEEDBACK_DETAIL} element={<FeedbackDetailPage />} />
      </Route>

      <Route path={ROUTE_PATH.NOTFOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
