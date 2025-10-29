import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../routes/routePath';

const OauthRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('=== OAuth 리다이렉트 페이지 진입 ===');
    console.log('현재 URL:', window.location.href);
    console.log('Search Params:', Object.fromEntries(searchParams.entries()));
    
    const accessToken = searchParams.get('token');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('Access Token:', accessToken);
    console.log('Error:', error);
    console.log('Error Description:', errorDescription);

    if (accessToken) {
      console.log('✅ 토큰 발견, 로컬스토리지에 저장');
      localStorage.setItem('accessToken', accessToken);
      
      console.log('저장된 토큰 확인:', localStorage.getItem('accessToken'));
      
      console.log('홈으로 이동 시도:', ROUTE_PATH.HOME);
      
      // history 조작 제거하고 navigate만 사용
      navigate(ROUTE_PATH.HOME, { replace: true });
    } else {
      console.log('❌ 토큰 없음 - 로그인 실패');
      console.log('에러 정보:', { error, errorDescription });
      
      alert(`로그인에 실패하였습니다. ${errorDescription || '다시 시도해주세요.'}`);
      navigate(ROUTE_PATH.LOGIN, { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div>로그인 처리 중입니다...</div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        개발자 도구 Console을 확인해주세요
      </div>
    </div>
  );
};

export default OauthRedirectPage;