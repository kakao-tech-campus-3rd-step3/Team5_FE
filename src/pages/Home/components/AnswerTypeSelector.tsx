import styled from '@emotion/styled';
import { Keyboard, Mic } from 'lucide-react';
import type { AnswerType } from '../Home';
import type { ChangeEvent } from 'react';

interface AnswerTypeSelectorProps {
  type: AnswerType;
  onAnswerTypeChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AnswerTypeSelector = ({ type, onAnswerTypeChange }: AnswerTypeSelectorProps) => {
  return (
    <>
      <h2>답변 방식을 선택해주세요.</h2>
      <Wrapper>
        <AnswerTypeLabel htmlFor="voice-option" isSelected={type === 'voice'}>
          <HiddenRadioInput
            type="radio"
            id="voice-option"
            name="answerType"
            value="voice"
            checked={type === 'voice'}
            onChange={onAnswerTypeChange}
          />
          <Mic size={40} />
        </AnswerTypeLabel>

        <AnswerTypeLabel isSelected={type === 'text'}>
          <HiddenRadioInput
            type="radio"
            id="text-option"
            name="answerType"
            value="text"
            checked={type === 'text'}
            onChange={onAnswerTypeChange}
          />
          <Keyboard size={40} />
        </AnswerTypeLabel>
      </Wrapper>
    </>
  );
};

export default AnswerTypeSelector;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
`;

const AnswerTypeLabel = styled.label<{ isSelected: boolean }>`
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

const HiddenRadioInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  cursor: pointer;
`;
