import styled from '@emotion/styled';
import Logo from '../../shared/ui/Logo';
import Tagline from '../../shared/components/Branding/Tagline';
import { API_BASE_URL } from '../../api/apiClient';

const KAKAO_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/kakao`;
const GOOGLE_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/google`;

const LoginPage = () => {
  return (
    <Wrapper>
      <BrandingSection>
        <Logo size="large" color="#333" />
        <Tagline size="medium" color="#666" />
      </BrandingSection>

      <LoginButtonSection>
        <KakaoLoginButton href={KAKAO_AUTH_URL}>
          <KakaoIcon>💬</KakaoIcon>
          Login with Kakao
        </KakaoLoginButton>

        <GoogleLoginButton href={GOOGLE_AUTH_URL}>
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

const BaseLoginLink = styled.a`
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
  text-decoration: none; /* 링크의 기본 밑줄 제거 */

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const KakaoLoginButton = styled(BaseLoginLink)`
  background-color: #fee500;
  color: #3c1e1e;

  &:hover {
    background-color: #fdd835;
  }
`;

const GoogleLoginButton = styled(BaseLoginLink)`
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
