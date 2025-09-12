import { Route, Routes } from 'react-router-dom';
import { ROUTE_PATH } from './routhPath';
import LoginPage from '../pages/Login/Login';
import ArchivePage from '../pages/Archive/Archive';
import FeedbackPage from '../pages/Feedback/Feedback';
import SubscribePage from '../pages/Subscribe/Subscribe';
import Layout from '../layouts/Layout';
import HomePage from '../pages/Home/Home';

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTE_PATH.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_PATH.HOME} element={<HomePage />} />
        <Route path={ROUTE_PATH.ARCHIVE} element={<ArchivePage />} />
        <Route path={ROUTE_PATH.SUBSCRIBE} element={<SubscribePage />} />
      </Route>
      <Route path={ROUTE_PATH.FEEDBACK} element={<FeedbackPage />} />
    </Routes>
  );
};

export default AppRouter;
