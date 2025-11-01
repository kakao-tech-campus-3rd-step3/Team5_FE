import styled from '@emotion/styled';

import Tagline from '../../shared/components/Branding/Tagline';
import Logo from '../../shared/ui/Logo';

interface PluginInstallPageProps {
  onInstall: () => void;
}

const PluginInstallPage = ({ onInstall }: PluginInstallPageProps) => {
  const handleInstallClick = () => {
    // TODO: 플러그인 설치 로직 구현
    console.log('플러그인 설치');
    onInstall();
  };

  return (
    <Wrapper>
      <BrandingSection>
        <Logo size="large" color="#333" />
        <Tagline size="medium" color="#666" />
      </BrandingSection>

      <ContentSection>
        <MainMessage>
          <MainText>오직 당신을 위한</MainText>
          <HighlightText>AI 면접 도우미</HighlightText>
        </MainMessage>

        <SubMessage>
          <SubText>하루에 하나씩,</SubText>
          <SubText>부담없이 시작하세요.</SubText>
        </SubMessage>
      </ContentSection>

      <ActionSection>
        <InstallButton type="button" onClick={handleInstallClick}>
          플러그인 설치하기
        </InstallButton>
      </ActionSection>
    </Wrapper>
  );
};

export default PluginInstallPage;

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

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 24px;
`;

const MainMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MainText = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
`;

const HighlightText = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1.4;
`;

const SubMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SubText = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #333;
  line-height: 1.4;
`;

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 320px;
`;

const InstallButton = styled.button`
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #e98b8b;
  color: white;

  &:hover {
    background-color: #d77a7a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(233, 139, 139, 0.3);
  }

  &:active {
    background-color: #c46969;
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(233, 139, 139, 0.2);
  }
`;
