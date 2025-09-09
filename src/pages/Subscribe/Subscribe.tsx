import React from 'react';
import styled from '@emotion/styled';
import GNB from '../../components/GNB/GNB';
import PricingCard from '../../components/Subscribe/PricingCard';
import BenefitsCard from '../../components/Subscribe/BenefitsCard';

const SubscribePage: React.FC = () => {
  const monthlyPrice = 15900;
  const benefits = ['일일 질문 한도 추가', '자소서 기반 맞춤 질문 생성'];

  return (
    <Container>
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

      <SubscribeButton>구독하기</SubscribeButton>

      <GNB />
    </Container>
  );
};

export default SubscribePage;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f5dc 0%, #f0e68c 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
  margin-top: 40px;
`;

const MainTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin: 0;
`;


const SubscribeButton = styled.button`
  background-color: #333333;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  width: 100%;
  max-width: 320px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 80px;

  &:hover {
    background-color: #444444;
  }

  &:active {
    background-color: #222222;
  }
`;

