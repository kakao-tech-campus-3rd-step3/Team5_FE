import { Route, Routes } from 'react-router-dom';
import { ROUTE_PATH } from './routePath';
import ArchivePage from '../pages/Archive/Archive';
import FeedbackPage from '../pages/Feedback/Feedback';
import SubscribePage from '../pages/Subscribe/Subscribe';
import HomePage from '../pages/Home/Home';
import RivalPage from '../pages/Rival/Rival';
import NotFound from '../pages/NotFound/NotFound';
import MainLayout from '../shared/layouts/MainLayout';
import AuthLayout from '../shared/layouts/AuthLayout';
import FeedbackDetailPage from '../pages/FeedbackDetail/FeedbackDetail';
import ModalLayout from '../shared/layouts/ModalLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/Login/Login';
import OauthRedirectPage from '../pages/Login/OauthRedirectPage';

const AppRouter = () => {
  // 실제 로그인 상태 확인
  const isAuthenticated = !!localStorage.getItem('accessToken');
  
  console.log('=== AppRouter 렌더링 ===');
  console.log('현재 인증 상태:', isAuthenticated);
  console.log('저장된 토큰:', localStorage.getItem('accessToken'));
  console.log('현재 경로:', window.location.pathname);
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
      <Route path="/login/oauth" element={<OauthRedirectPage />} />

      <Route element={<ModalLayout />}>
        <Route path={ROUTE_PATH.FEEDBACK} element={<FeedbackPage />} />
        <Route path={ROUTE_PATH.FEEDBACK_DETAIL} element={<FeedbackDetailPage />} />
      </Route>

      <Route path={ROUTE_PATH.NOTFOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
