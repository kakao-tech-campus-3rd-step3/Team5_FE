import styled from '@emotion/styled';
import AnswerButton from '../../../../shared/ui/SharedButton';
import type { AnswerStateType, AnswerType } from '../../Home';
import AnswerInput from '../AnswerInput';
import { useState, type ChangeEvent } from 'react';

interface AnsweringSectionProps {
  type: AnswerType;
  answerState: AnswerStateType;
  onAnswerDone: (answerText: string, audioUrl?: string) => void;
  isSubmitting?: boolean;
}

const AnsweringSection = ({ type, answerState, onAnswerDone, isSubmitting = false }: AnsweringSectionProps) => {
  const [answerText, setAnswerText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string>('');

  const handleAnswerDone = () => {
    if (type === 'voice' && audioUrl) {
      onAnswerDone(answerText, audioUrl);
    } else {
      onAnswerDone(answerText);
    }
  };

  return (
    <section>
      <Wrapper>
        <AnswerInput
          type={type}
          isActive={answerState === 'answering'}
          onAnswerDone={handleAnswerDone}
          value={answerText}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAnswerText(e.target.value)}
          onAudioUrlChange={setAudioUrl}
        />
        <AnswerButton 
          type="button" 
          onClick={handleAnswerDone} 
          disabled={!type || isSubmitting}
        >
          {isSubmitting ? '제출 중...' : '답변 완료'}
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
