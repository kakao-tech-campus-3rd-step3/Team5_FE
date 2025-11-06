import { useState, type ChangeEvent } from 'react';

import styled from '@emotion/styled';
import { generatePath, useNavigate } from 'react-router-dom';

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
  followUp?: boolean;
}

const AnsweringSection = ({
  type,
  answerState,
  onAnswerDone,
  isSubmitting = false,
  questionId,
  followUp,
}: AnsweringSectionProps) => {
  const navigate = useNavigate();
  const [answerText, setAnswerText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [convertedText, setConvertedText] = useState<string>('');

  const handleAnswerDone = () => {
    // 음성 답변인 경우
    if (type === 'voice' && audioUrl) {
      // audioUrl이 없거나 빈 문자열이면 아직 녹음/업로드가 완료되지 않은 상태
      if (!audioUrl || audioUrl.trim() === '') {
        console.warn('⚠️ [AnsweringSection] 음성 답변인데 audioUrl이 없습니다:', {
          audioUrl,
          type,
          note: '녹음 및 업로드가 완료될 때까지 기다려주세요.',
        });
        alert('녹음 및 업로드가 완료될 때까지 기다려주세요.');
        return;
      }

      // 음성 답변의 경우 변환된 텍스트 또는 기본 텍스트 사용
      // STT 변환이 완료되기 전에는 convertedText가 비어있을 수 있음
      const finalText = convertedText || answerText || '';
      console.log('📤 [AnsweringSection] 음성 답변 제출:', {
        finalText,
        audioUrl,
        convertedText,
        answerText,
        type,
        note: 'STT 변환이 완료되기 전에는 answerText가 비어있을 수 있습니다. 백엔드가 처리합니다.',
      });
      // 음성 답변인 경우 answerText가 비어있어도 괜찮음 (백엔드가 STT 처리)
      onAnswerDone(finalText, audioUrl);
    } else {
      // 텍스트 답변인 경우
      if (!answerText || answerText.trim() === '') {
        console.error('❌ [AnsweringSection] 텍스트 답변인데 answerText가 비어있습니다:', {
          answerText,
          type,
        });
        alert('답변을 입력해주세요.');
        return;
      }
      console.log('📤 [AnsweringSection] 텍스트 답변 제출:', {
        answerText,
        type,
      });
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

    // ⚠️ 중요: alreadySubmitted가 true이면 이미 제출된 상태이므로
    // feedbackId가 있으면 피드백 페이지로 이동, 없어도 중복 제출하지 않음
    if (alreadySubmitted) {
      if (feedbackId) {
        console.log('✅ [AnsweringSection] 이미 제출 완료 - 피드백 페이지로 이동', {
          audioUrl,
          text,
          alreadySubmitted,
          feedbackId,
        });

        // RecordAnswer에서 이미 제출했으므로 중복 제출 없이
        // feedbackId를 사용하여 피드백 페이지로 바로 이동
        navigate(generatePath(ROUTE_PATH.FEEDBACK, { id: String(feedbackId) }));
      } else {
        console.warn(
          '⚠️ [AnsweringSection] alreadySubmitted=true이지만 feedbackId가 없습니다. 중복 제출 방지:',
          {
            audioUrl,
            text,
            alreadySubmitted,
            note: '이미 제출된 상태이므로 추가 제출하지 않습니다.',
          }
        );
      }
      return; // 이미 제출된 경우 항상 return (중복 제출 방지)
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
          followUp={followUp}
        />
        <AnswerButton
          type="button"
          onClick={handleAnswerDone}
          disabled={
            isSubmitting ||
            (type === 'text' && answerText.trim() === '') ||
            (type === 'voice' && (!audioUrl || audioUrl.trim() === ''))
          }
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
