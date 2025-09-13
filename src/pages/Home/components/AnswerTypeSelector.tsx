import styled from '@emotion/styled';
import { Keyboard, Mic } from 'lucide-react';
import type { AnswerType } from '../Home';

interface AnswerTypeSelectorProps {
  type: AnswerType;
  onAnswerType: (type: AnswerType) => void;
}

const AnswerTypeSelector = ({ type, onAnswerType }: AnswerTypeSelectorProps) => {
  return (
    <>
      <span>답변 방식을 선택해주세요.</span>
      <AnswerTypeSelectorWrapper>
        <AnswerTypeButton isSelected={type === 'voice'} onClick={() => onAnswerType('voice')}>
          <Mic size={40} />
        </AnswerTypeButton>

        <AnswerTypeButton isSelected={type === 'text'} onClick={() => onAnswerType('text')}>
          <Keyboard size={40} />
        </AnswerTypeButton>
      </AnswerTypeSelectorWrapper>
    </>
  );
};

export default AnswerTypeSelector;

const AnswerTypeSelectorWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
`;

const AnswerTypeButton = styled.button<{ isSelected: boolean }>`
  padding: 1.5rem;
  border-radius: 14px;
  border-width: 2px;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  background-color: ${(props) =>
    props.isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(55, 65, 81, 0.5)'};
  border-color: ${(props) => (props.isSelected ? '#06b6d4' : '#4b5563')};

  &:hover {
    border-color: ${(props) => (props.isSelected ? '#06b6d4' : '#6b7280')};
  }

  svg {
    color: ${(props) => (props.isSelected ? '#22d3ee' : '#9ca3af')};
    transition: color 0.3s ease-in-out;
  }
`;
