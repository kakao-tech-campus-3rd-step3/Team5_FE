import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import PricingCard from './components/PricingCard';
import BenefitsCard from './components/BenefitsCard';

const SubscribePage = () => {
  const monthlyPrice = 15900;
  const benefits = ['일일 질문 한도 추가', '자소서 기반 맞춤 질문 생성'];

  return (
    <Wrapper>
      <HeaderSection>
        <MainTitle>
          더 많은 질문을 원하시나요?
          <br />
          구독 후 자유롭게 이용하세요.
        </MainTitle>
      </HeaderSection>

      <PricingCard
        title="Premium 요금제"
        description="당신만을 위한 AI 면접 도우미를 자유롭게 활용하세요."
        price={monthlyPrice}
        highlighted
      />

      <BenefitsCard title="Premium 혜택" benefits={benefits} price={monthlyPrice} />

      <SubscribeButton type="button">구독하기</SubscribeButton>
    </Wrapper>
  );
};

export default SubscribePage;

const Wrapper = styled.div`
  min-height: 100vh;
  background: ${theme.colors.backgroundGradient};
  padding: ${theme.space.space24};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.space.space40};
  margin-top: ${theme.space.space48};
`;

const MainTitle = styled.h1`
  font-size: ${theme.typography.fontSizes.h2};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.text};
  line-height: 1.4;
  margin: 0;
`;

const SubscribeButton = styled.button`
  background-color: ${theme.colors.text};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radius.radius16};
  padding: ${theme.space.space16} ${theme.space.space32};
  font-size: ${theme.typography.fontSizes.body};
  font-weight: ${theme.typography.fontWeights.bold};
  width: 100%;
  max-width: 320px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${theme.space.space64};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;
