import styled from '@emotion/styled';
import Logo from '../../shared/ui/Logo';
import Tagline from '../../shared/components/Branding/Tagline';

import { API_BASE_URL } from '../../api/apiClient';

// 리다이렉트 URI 설정
const getRedirectUri = () => {
  const currentOrigin = window.location.origin;
  return `${currentOrigin}/login/oauth`;
};

const LoginPage = () => {
  // 실제 OAuth 로그인으로 리다이렉트
  const handleKakaoLogin = () => {
    const redirectUri = getRedirectUri();
    // OAuth URL 생성 (redirect_uri는 백엔드 설정에 따라 선택적)
    const kakaoAuthUrl = `${API_BASE_URL}/oauth2/authorization/kakao`;
    
    console.log('🔐 카카오 로그인 시작');
    console.log('📍 현재 도메인:', window.location.origin);
    console.log('📍 현재 경로:', window.location.pathname);
    console.log('📍 예상 리다이렉트 URI:', redirectUri);
    console.log('🌐 OAuth URL:', kakaoAuthUrl);
    console.log('🌐 API_BASE_URL:', API_BASE_URL);
    console.log('⚠️ 백엔드 OAuth 서버로 이동합니다...');
    
    // 실제 서버 확인
    if (API_BASE_URL.includes('localhost:8080')) {
      console.warn('⚠️ localhost:8080으로 설정되어 있습니다. 백엔드 서버가 실행 중인지 확인하세요.');
    }
    
    // OAuth 인증을 위해 백엔드 서버로 이동 (전체 페이지 리다이렉트)
    window.location.href = kakaoAuthUrl;
  };

  const handleGoogleLogin = () => {
    const redirectUri = getRedirectUri();
    const googleAuthUrl = `${API_BASE_URL}/oauth2/authorization/google`;
    
    console.log('🔐 구글 로그인 시작');
    console.log('📍 현재 도메인:', window.location.origin);
    console.log('📍 현재 경로:', window.location.pathname);
    console.log('📍 예상 리다이렉트 URI:', redirectUri);
    console.log('🌐 OAuth URL:', googleAuthUrl);
    console.log('🌐 API_BASE_URL:', API_BASE_URL);
    console.log('⚠️ 백엔드 OAuth 서버로 이동합니다...');
    
    // 실제 서버 확인
    if (API_BASE_URL.includes('localhost:8080')) {
      console.warn('⚠️ localhost:8080으로 설정되어 있습니다. 백엔드 서버가 실행 중인지 확인하세요.');
    }
    
    // OAuth 인증을 위해 백엔드 서버로 이동 (전체 페이지 리다이렉트)
    window.location.href = googleAuthUrl;
  };

  return (
    <Wrapper>
      <BrandingSection>
        <Logo size="large" color="#333" />
        <Tagline size="medium" color="#666" />
      </BrandingSection>

      <LoginButtonSection>
        <KakaoLoginButton 
          type="button" 
          onClick={handleKakaoLogin}
        >
          <KakaoIcon>💬</KakaoIcon>
          Login with Kakao
        </KakaoLoginButton>

        <GoogleLoginButton 
          type="button" 
          onClick={handleGoogleLogin}
        >
          <GoogleIcon>G</GoogleIcon>
          Sign in with Google
        </GoogleLoginButton>
      </LoginButtonSection>
    </Wrapper>
  );
};

export default LoginPage;

const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f5dc 0%, #f4c2c2 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 80px 20px 60px;
`;

const BrandingSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const LoginButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 320px;
`;

const BaseLoginButton = styled.button`
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const KakaoLoginButton = styled(BaseLoginButton)`
  background-color: #fee500;
  color: #3c1e1e;

  &:hover {
    background-color: #fdd835;
  }
`;

const GoogleLoginButton = styled(BaseLoginButton)`
  background-color: #ffffff;
  color: #333;
  border: 1px solid #dadce0;

  &:hover {
    background-color: #f8f9fa;
    border-color: #c1c7cd;
  }
`;

const KakaoIcon = styled.span`
  font-size: 20px;
`;

const GoogleIcon = styled.span`
  width: 20px;
  height: 20px;
  background-color: #4285f4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
`;
