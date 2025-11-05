import { useState } from 'react';

import styled from '@emotion/styled';
import { Star } from 'lucide-react';

import SharedButton from '../../../shared/ui/SharedButton';

interface LevelModalProps {
  currentLevel: number;
  onClose: () => void;
  onSave: (newLevel: number) => Promise<void>;
}

const LevelModal = ({ currentLevel, onClose, onSave }: LevelModalProps) => {
  const [selectedLevel, setSelectedLevel] = useState(currentLevel);
  const [isSaving, setIsSaving] = useState(false);

  // 별을 클릭했을 때 선택된 난이도 업데이트
  const handleLevelClick = (level: number) => {
    setSelectedLevel(level);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      await onSave(selectedLevel);
    } catch (error) {
      console.error('난이도 저장 실패 :', error);
      setIsSaving(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      {/* 2. 모달 컨텐츠 (클릭해도 닫히지 않게 이벤트 전파 차단) */}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>난이도 설정</ModalTitle>
        <ModalText>이 질문의 난이도를 설정해주세요.</ModalText>

        <StarWrapper>
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <StyledStar
              key={starIndex}
              onClick={() => handleLevelClick(starIndex)}
              fill={starIndex <= selectedLevel ? '#FFD700' : 'none'}
              color="#FFD700"
              size={40}
            />
          ))}
        </StarWrapper>

        <ButtonWrapper>
          <CloseButton type="button" onClick={onClose} disabled={isSaving}>
            취소
          </CloseButton>
          <SaveButton type="button" onClick={handleSaveClick} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장 및 이동'}
          </SaveButton>
        </ButtonWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default LevelModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  padding: 32px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  margin: 0;
`;

const ModalText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const StarWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const StyledStar = styled(Star)`
  cursor: pointer;
  transition: all 0.1s ease-in-out;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

// SharedButton을 확장(extend)하여 스타일만 변경
const CloseButton = styled(SharedButton)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.greyLighter};
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey};
  }
`;

const SaveButton = styled(SharedButton)`
  flex: 1;
`;
