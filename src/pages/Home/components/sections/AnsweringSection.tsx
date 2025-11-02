import { useState, type ChangeEvent } from 'react';

import styled from '@emotion/styled';

import AnswerButton from '../../../../shared/ui/SharedButton';
import AnswerInput from '../AnswerInput';

import type { AnswerStateType, AnswerType } from '../../Home';

interface AnsweringSectionProps {
  type: AnswerType;
  answerState: AnswerStateType;
  onAnswerDone: (answerText: string, audioUrl?: string) => void;
  isSubmitting?: boolean;
}

const AnsweringSection = ({
  type,
  answerState,
  onAnswerDone,
  isSubmitting = false,
}: AnsweringSectionProps) => {
  const [answerText, setAnswerText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [convertedText, setConvertedText] = useState<string>('');

  const handleAnswerDone = () => {
    if (type === 'voice' && audioUrl) {
      // 음성 답변의 경우 변환된 텍스트 또는 기본 텍스트 사용
      const finalText = convertedText || answerText || '음성 답변';
      onAnswerDone(finalText, audioUrl);
    } else {
      onAnswerDone(answerText);
    }
  };

  // RecordAnswer에서 완료된 답변 처리
  const handleAnswerComplete = (audioUrl: string, text?: string) => {
    setAudioUrl(audioUrl);
    if (text) {
      setConvertedText(text);
    }
    // 음성 답변 완료 시 자동으로 제출
    setTimeout(() => {
      const finalText = text || '음성 답변';
      onAnswerDone(finalText, audioUrl);
    }, 500);
  };

  // 에러 처리
  const handleError = (error: string) => {
    console.error('음성 답변 오류:', error);
    alert(`음성 답변 중 오류가 발생했습니다: ${error}`);
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
          onAnswerComplete={handleAnswerComplete}
          onError={handleError}
        />
        <AnswerButton
          type="button"
          onClick={handleAnswerDone}
          disabled={isSubmitting || (type === 'text' && answerText.trim() === '')}
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
