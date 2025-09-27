import { Route, Routes } from 'react-router-dom';
import { ROUTE_PATH } from './routePath';
import LoginPage from '../pages/Login/Login';
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

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTE_PATH.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_PATH.HOME} element={<HomePage />} />
        <Route path={ROUTE_PATH.ARCHIVE} element={<ArchivePage />} />
        <Route path={ROUTE_PATH.SUBSCRIBE} element={<SubscribePage />} />
        <Route path={ROUTE_PATH.NOTFOUND} element={<NotFound />} />
        <Route path={ROUTE_PATH.RIVAL} element={<RivalPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        {/* TODO: LOGINPAGE 등 네비, 푸터 없이 콘텐츠만 보여줘야 하는 레이아웃 추가 */}
      </Route>
      <Route element={<ModalLayout />}>
        <Route path={ROUTE_PATH.FEEDBACK} element={<FeedbackPage />} />
        <Route path={ROUTE_PATH.FEEDBACKDETAIL} element={<FeedbackDetailPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
