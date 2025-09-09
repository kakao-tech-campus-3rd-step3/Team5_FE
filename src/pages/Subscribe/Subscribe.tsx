import React from 'react';
import styled from '@emotion/styled';
import GNB from '../../components/GNB/GNB';

// 통화 포맷팅 유틸리티 함수
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ko-KR');
};

const SubscribePage: React.FC = () => {
  const monthlyPrice = 15900;
  return (
    <Container>
      <HeaderSection>
        <MainTitle>
          더 많은 질문을 원하시나요?
          <br />
          구독 후 자유롭게 이용하세요.
        </MainTitle>
      </HeaderSection>

      <PremiumCard>
        <PremiumTitle>Premium 요금제</PremiumTitle>
        <PremiumDescription>당신만을 위한 AI 면접 도우미를 자유롭게 활용하세요.</PremiumDescription>
        <PremiumPrice>매달 ₩{formatCurrency(monthlyPrice)}</PremiumPrice>
      </PremiumCard>

      <BenefitsCard>
        <BenefitsTitle>Premium 혜택</BenefitsTitle>
        <BenefitsList>
          <BenefitItem>일일 질문 한도 추가</BenefitItem>
          <BenefitItem>자소서 기반 맞춤 질문 생성</BenefitItem>
        </BenefitsList>
        <BenefitsPrice>매달 ₩{formatCurrency(monthlyPrice)}</BenefitsPrice>
      </BenefitsCard>

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

const PremiumCard = styled.div`
  background-color: #e98b8b;
  border: 2px solid #6699ff;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 16px;
  text-align: center;
`;

const PremiumTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
`;

const PremiumDescription = styled.p`
  font-size: 14px;
  color: white;
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

const PremiumPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

const BenefitsCard = styled.div`
  background-color: #e98b8b;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 24px;
  text-align: center;
`;

const BenefitsTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
`;

const BenefitsList = styled.ul`
  text-align: left;
  margin-bottom: 16px;
  padding-left: 20px;
  list-style-type: disc;
`;

const BenefitItem = styled.li`
  font-size: 14px;
  color: white;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const BenefitsPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
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

