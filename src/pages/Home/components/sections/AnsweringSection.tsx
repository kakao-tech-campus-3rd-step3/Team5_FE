import { useState, type ChangeEvent } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { ROUTE_PATH } from '../../../../routes/routePath';
import AnswerButton from '../../../../shared/ui/SharedButton';
import AnswerInput from '../AnswerInput';

import type { AnswerStateType, AnswerType } from '../../Home';

interface AnsweringSectionProps {
  type: AnswerType;
  answerState: AnswerStateType;
  onAnswerDone: (answerText: string, audioUrl?: string) => void;
  isSubmitting?: boolean;
  questionId?: number;
}

const AnsweringSection = ({
  type,
  answerState,
  onAnswerDone,
  isSubmitting = false,
  questionId,
}: AnsweringSectionProps) => {
  const navigate = useNavigate();
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
  const handleAnswerComplete = (
    audioUrl: string,
    text?: string,
    alreadySubmitted?: boolean,
    feedbackId?: number
  ) => {
    setAudioUrl(audioUrl);
    if (text) {
      setConvertedText(text);
    }
    
    // 이미 제출된 경우 (RecordAnswer에서 이미 POST 완료)
    // feedbackId가 있으면 피드백 페이지로 바로 이동, 추가 제출하지 않음
    if (alreadySubmitted && feedbackId) {
      console.log('✅ [AnsweringSection] 이미 제출 완료 - 피드백 페이지로 이동', {
        audioUrl,
        text,
        alreadySubmitted,
        feedbackId,
      });
      
      // RecordAnswer에서 이미 제출했으므로 중복 제출 없이
      // feedbackId를 사용하여 피드백 페이지로 바로 이동
      navigate(ROUTE_PATH.FEEDBACK, { state: { feedbackId } });
      return;
    }
    
    // 아직 제출되지 않은 경우에만 제출
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
          questionId={questionId}
          answerText={answerText}
        />
        <AnswerButton type="button" onClick={handleAnswerDone} disabled={!type || isSubmitting}>
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
