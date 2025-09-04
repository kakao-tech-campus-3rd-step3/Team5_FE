import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F5DC 0%, #F0E68C 100%);
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
  background-color: #E98B8B;
  border: 2px solid #6699FF;
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
  background-color: #E98B8B;
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

const BenefitsList = styled.div`
  text-align: left;
  margin-bottom: 16px;
`;

const BenefitItem = styled.div`
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
  
  &:hover {
    background-color: #444444;
  }
  
  &:active {
    background-color: #222222;
  }
`;

const SubscribePage: React.FC = () => {
  return (
    <Container>
      <HeaderSection>
        <MainTitle>
          더 많은 질문을 원하시나요?<br />
          구독 후 자유롭게 이용하세요.
        </MainTitle>
      </HeaderSection>
      
      <PremiumCard>
        <PremiumTitle>Premium 요금제</PremiumTitle>
        <PremiumDescription>
          당신만을 위한 AI 면접 도우미를 자유롭게 활용하세요.
        </PremiumDescription>
        <PremiumPrice>매달 ₩ 15,900</PremiumPrice>
      </PremiumCard>
      
      <BenefitsCard>
        <BenefitsTitle>Premium 혜택</BenefitsTitle>
        <BenefitsList>
          <BenefitItem>• 일일 질문 한도 추가</BenefitItem>
          <BenefitItem>• 자소서 기반 맞춤 질문 생성</BenefitItem>
        </BenefitsList>
        <BenefitsPrice>매달 ₩15,900</BenefitsPrice>
      </BenefitsCard>
      
      <SubscribeButton>
        구독하기
      </SubscribeButton>
    </Container>
  );
};

export default SubscribePage;
