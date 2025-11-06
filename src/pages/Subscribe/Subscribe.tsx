import { useState } from 'react';

import styled from '@emotion/styled';
import { X } from 'lucide-react';

import { theme } from '../../styles/theme';

import BenefitsCard from './components/BenefitsCard';
import PricingCard from './components/PricingCard';

const SubscribePage = () => {
  const monthlyPrice = 15900;
  const benefits = ['일일 질문 한도 추가', '자소서 기반 맞춤 질문 생성'];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscribe = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Wrapper>
      <HeaderSection>
        <MainTitle>
          더 많은 질문을 원하시나요?
          <br />
          구독 후 자유롭게 이용하세요.
        </MainTitle>
      </HeaderSection>

      <CardSection>
        <PricingCard
          title="Premium 요금제"
          description="당신만을 위한 AI 면접 도우미를<br/>자유롭게 활용하세요."
          price={monthlyPrice}
          highlighted
        />

        <BenefitsCard title="Premium 혜택" benefits={benefits} />
      </CardSection>

      <ButtonSection>
        <SubscribeButton type="button" onClick={handleSubscribe}>
          구독하기
        </SubscribeButton>
      </ButtonSection>

      {/* 모달 */}
      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>알림</ModalTitle>
              <CloseButton type="button" onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <ModalMessage>추후 구현 예정입니다.</ModalMessage>
            </ModalBody>
            <ModalFooter>
              <ConfirmButton type="button" onClick={handleCloseModal}>
                확인
              </ConfirmButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
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
  margin-top: ${theme.space.space24};
`;

const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.space16};
  margin-bottom: ${theme.space.space16};
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.space.space64};
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.radius16};
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.space.space24};
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.fontSizes.h3};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text};
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radius.radius4};
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const ModalBody = styled.div`
  padding: ${theme.space.space24};
`;

const ModalMessage = styled.p`
  font-size: ${theme.typography.fontSizes.body};
  color: ${theme.colors.text};
  margin: 0;
  text-align: center;
  line-height: 1.6;
`;

const ModalFooter = styled.div`
  padding: ${theme.space.space16} ${theme.space.space24};
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
`;

const ConfirmButton = styled.button`
  background-color: ${theme.colors.pointCoral || theme.colors.secondary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radius.radius8};
  padding: ${theme.space.space12} ${theme.space.space24};
  font-size: ${theme.typography.fontSizes.body};
  font-weight: ${theme.typography.fontWeights.bold};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 142, 142, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;
