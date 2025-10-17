import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../routes/routePath';

const OauthRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('token');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);

      window.history.replaceState({}, '', ROUTE_PATH.HOME);
      
      navigate(ROUTE_PATH.HOME, { replace: true });
    } else {
      alert('로그인에 실패하였습니다. 다시 시도해주세요.');
      navigate(ROUTE_PATH.LOGIN, { replace: true });
    }
  }, [navigate, searchParams]);

  return <div>로그인 중입니다...</div>;
};

export default OauthRedirectPage;