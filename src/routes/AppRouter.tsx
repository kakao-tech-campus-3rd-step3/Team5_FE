import { useEffect, useState } from 'react';

import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import { refreshAccessToken } from '../api/auth';
import ArchivePage from '../pages/Archive/Archive';
import FeedbackPage from '../pages/Feedback/Feedback';
import FeedbackDetailPage from '../pages/FeedbackDetail/FeedbackDetail';
import HomePage from '../pages/Home/Home';
import LoginPage from '../pages/Login/Login';
import OauthRedirectPage from '../pages/Login/OauthRedirectPage';
import NotFound from '../pages/NotFound/NotFound';
import RivalPage from '../pages/Rival/Rival';
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
      return false;
    }

    try {
      const response = await refreshAccessToken(refreshToken);

      // 응답에서 토큰 추출 (필드명이 정확하지 않을 수 있으므로 유연하게 처리)
      const newAccessToken = response.accessToken || response[Object.keys(response)[0]];
      const newRefreshToken =
        response.refreshToken || response[Object.keys(response)[1]] || refreshToken;

      if (newAccessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        if (newRefreshToken !== refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        }
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      // 갱신 실패 시 토큰 삭제
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setIsAuthenticated(false);
      return false;
    }

    return false;
  };

  // 인증 상태 확인 및 자동 갱신
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);

      // URL 파라미터에서 토큰이 있으면 즉시 파싱 및 저장 (OAuth 리다이렉트)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token') || urlParams.get('accessToken');
      const refreshTokenFromUrl = urlParams.get('refreshToken') || urlParams.get('refresh_token');

      if (tokenFromUrl) {
        // 토큰 즉시 저장
        localStorage.setItem(ACCESS_TOKEN_KEY, tokenFromUrl);
        if (refreshTokenFromUrl) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenFromUrl);
        }

        // URL에서 토큰 파라미터 제거 (보안)
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('token');
        newUrl.searchParams.delete('accessToken');
        newUrl.searchParams.delete('refreshToken');
        newUrl.searchParams.delete('refresh_token');
        window.history.replaceState({}, '', newUrl.toString());

        // 인증 상태 업데이트 및 홈으로 이동
        setIsAuthenticated(true);
        setIsCheckingAuth(false);

        // 홈이 아닌 경우에만 이동
        if (location.pathname !== ROUTE_PATH.HOME) {
          navigate(ROUTE_PATH.HOME, { replace: true });
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
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        {/* TODO: LOGINPAGE 등 네비, 푸터 없이 콘텐츠만 보여줘야 하는 레이아웃 추가 */}
        <Route path={ROUTE_PATH.LOGIN} element={<LoginPage />} />
      </Route>
      <Route path={ROUTE_PATH.LOGIN_OAUTH} element={<OauthRedirectPage />} />

      <Route element={<ModalLayout />}>
        <Route path={`${ROUTE_PATH.FEEDBACK}/:feedbackId`} element={<FeedbackPage />} />
        <Route path={ROUTE_PATH.FEEDBACK_DETAIL} element={<FeedbackDetailPage />} />
      </Route>

      <Route path={ROUTE_PATH.NOTFOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
