import styled from '@emotion/styled';
import Logo from '../../components/Branding/Logo';
import Tagline from '../../components/Branding/Tagline';

const LoginPage = () => {
  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 로직 구현
    console.log('카카오 로그인');
  };

  const handleGoogleLogin = () => {
    // TODO: 구글 로그인 로직 구현
    console.log('구글 로그인');
  };

  return (
    <Wrapper>
      <BrandingSection>
        <Logo size="large" color="#333" />
        <Tagline size="medium" color="#666" />
      </BrandingSection>

      <LoginButtonSection>
        <KakaoLoginButton type="button" onClick={handleKakaoLogin}>
          <KakaoIcon>💬</KakaoIcon>
          Login with Kakao
        </KakaoLoginButton>

        <GoogleLoginButton type="button" onClick={handleGoogleLogin}>
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

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
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
