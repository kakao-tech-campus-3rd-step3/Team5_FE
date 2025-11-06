import type { ChangeEvent } from 'react';

import styled from '@emotion/styled';
import { Keyboard, Mic } from 'lucide-react';

import type { AnswerType } from '../Home';

interface AnswerTypeSelectorProps {
  type: AnswerType;
  onAnswerTypeChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AnswerTypeSelector = ({ type, onAnswerTypeChange }: AnswerTypeSelectorProps) => {
  return (
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

      <AnswerTypeLabel htmlFor="text-option" isSelected={type === 'text'}>
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
  );
};

export default AnswerTypeSelector;

const Wrapper = styled.div`
  display: grid;
  width: 300px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  margin-bottom: ${({ theme }) => theme.space.space24};
`;

const AnswerTypeLabel = styled.label<{ isSelected: boolean }>`
  padding: ${({ theme }) => theme.space.space12};
  border-radius: ${({ theme }) => theme.space.space12};
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: ${({ theme }) => theme.blurs.blur8};
  border-radius: ${({ theme }) => theme.radius.radius24};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  background-color: ${(props) =>
    props.isSelected ? 'rgba(236, 236, 236, 0.1)' : 'rgba(255, 255, 255, 0.3)'};

  svg {
    color: ${({ isSelected, theme }) =>
      isSelected
        ? theme.colors.pointCoral || theme.colors.secondary
        : theme.colors.pointCoral || '#FF8E8E'};
    transition: all 0.3s ease-in-out;
    filter: ${({ isSelected }) =>
      isSelected ? 'drop-shadow(0 2px 4px rgba(255, 142, 142, 0.4))' : 'none'};
  }

  &:hover svg {
    transform: scale(1.1);
    filter: drop-shadow(0 2px 6px rgba(255, 142, 142, 0.5));
  }
`;

const HiddenRadioInput = styled.input`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  cursor: pointer;
`;
