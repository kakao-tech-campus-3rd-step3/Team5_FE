import React from 'react';
import styled from '@emotion/styled';

const SubscribePage: React.FC = () => {
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

      <SubscribeButton>구독하기</SubscribeButton>

      <BottomNavigation>
        <NavItem>
          <HomeIcon />
        </NavItem>
        <NavItem>
          <SearchIcon />
        </NavItem>
        <NavItem>
          <DownloadIcon />
        </NavItem>
        <NavItem>
          <ProfileIcon />
        </NavItem>
      </BottomNavigation>
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
  margin-bottom: 80px;

  &:hover {
    background-color: #444444;
  }

  &:active {
    background-color: #222222;
  }
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f5f5dc;
  padding: 12px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #e0e0e0;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const NavIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
  margin-bottom: 4px;
  border-radius: 2px;

  /* 아이콘을 간단한 도형으로 표현 */
  &:nth-of-type(1) {
    /* 홈 아이콘 - 집 모양 */
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
`;

const HomeIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
  margin-bottom: 4px;
  border-radius: 2px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 8px;
    border: 2px solid #333;
    border-bottom: none;
    border-radius: 2px 2px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 4px;
    background-color: #333;
  }
`;

const SearchIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
  margin-bottom: 4px;
  border-radius: 50%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 8px;
    height: 2px;
    background-color: #333;
    transform: rotate(45deg);
  }
`;

const DownloadIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
  margin-bottom: 4px;
  border-radius: 2px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 6px;
    right: 6px;
    height: 2px;
    background-color: #f5f5dc;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 10px;
    width: 4px;
    height: 4px;
    background-color: #f5f5dc;
    border-radius: 50%;
  }
`;

const ProfileIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
  margin-bottom: 4px;
  border-radius: 50%;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 6px;
    right: 6px;
    height: 8px;
    background-color: #f5f5dc;
    border-radius: 4px 4px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 8px;
    right: 8px;
    height: 6px;
    background-color: #f5f5dc;
    border-radius: 0 0 3px 3px;
  }
`;
