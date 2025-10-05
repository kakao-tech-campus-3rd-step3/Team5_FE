import { Navigate, Outlet } from 'react-router-dom';
import { ROUTE_PATH } from './routePath';

interface ProtectedRouteProps {
  isAuth: boolean;
}

const ProtectedRoute = ({ isAuth }: ProtectedRouteProps) => {
  if (!isAuth) {
    // TODO: 로그인이 안되어있으면 로그인 페이지로 리다이렉트 혹은 익스텐션 설치 페이지로 이동
    return <Navigate to={ROUTE_PATH.LOGIN} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
