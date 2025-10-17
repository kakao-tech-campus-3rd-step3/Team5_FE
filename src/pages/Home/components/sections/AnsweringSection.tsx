import styled from '@emotion/styled';
import AnswerButton from '../../../../shared/ui/SharedButton';
import type { AnswerStateType, AnswerType } from '../../Home';
import AnswerInput from '../AnswerInput';
import { useState, type ChangeEvent } from 'react';

interface AnsweringSectionProps {
  type: AnswerType;
  answerState: AnswerStateType;
  onAnswerDone: (answerText: string) => void;
}

const AnsweringSection = ({ type, answerState, onAnswerDone }: AnsweringSectionProps) => {
  const [answerText, setAnswerText] = useState('');
  return (
    <section>
      <Wrapper>
        <AnswerInput
          type={type}
          isActive={answerState === 'answering'}
          onAnswerDone={() => onAnswerDone(answerText)}
          value={answerText}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAnswerText(e.target.value)}
        />
        <AnswerButton type="button" onClick={() => onAnswerDone(answerText)} disabled={!type}>
          답변 완료
        </AnswerButton>
      </Wrapper>
    </section>
  );
};

export default AnsweringSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.space64};
`;
