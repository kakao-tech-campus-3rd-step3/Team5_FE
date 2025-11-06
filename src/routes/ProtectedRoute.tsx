import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ROUTE_PATH } from './routePath';

interface ProtectedRouteProps {
  isAuth: boolean;
  isJobSelected: boolean;
}

const ProtectedRoute = ({ isAuth, isJobSelected }: ProtectedRouteProps) => {
  const location = useLocation();
  if (!isAuth) {
    // TODO: 로그인이 안되어있으면 로그인 페이지로 리다이렉트 혹은 익스텐션 설치 페이지로 이동
    return <Navigate to={ROUTE_PATH.LOGIN} replace />;
  }
  if (isAuth && !isJobSelected && location.pathname !== ROUTE_PATH.JOBSELECT) {
    // 4. -> 직업 선택 페이지로 강제 이동
    return <Navigate to={ROUTE_PATH.JOBSELECT} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
