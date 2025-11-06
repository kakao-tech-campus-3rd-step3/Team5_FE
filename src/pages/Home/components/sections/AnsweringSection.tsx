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
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false); // 이미 제출되었는지 추적
  const [submittedFeedbackId, setSubmittedFeedbackId] = useState<number | null>(null); // 제출된 feedbackId 저장

  const handleAnswerDone = () => {
    // ⚠️ 이미 제출된 경우: 피드백 페이지로 이동
    if (isAlreadySubmitted && submittedFeedbackId) {
      console.log('✅ [AnsweringSection] 이미 제출 완료 - 피드백 페이지로 이동:', {
        feedbackId: submittedFeedbackId,
        type,
      });
      navigate(generatePath(ROUTE_PATH.FEEDBACK, { id: String(submittedFeedbackId) }));
      return;
    }

    // ⚠️ 음성 답변인 경우: RecordAnswer에서 자동으로 제출하므로 버튼에서는 제출하지 않음
    // SSE 연결 후 제출이 완료되면 handleAnswerComplete에서 feedbackId를 받아서
    // 버튼이 "피드백 확인"으로 변경되고 클릭 시 피드백으로 이동
    if (type === 'voice') {
      // audioUrl이 없는 경우
      if (!audioUrl) {
        console.warn('⚠️ [AnsweringSection] 음성 답변인데 audioUrl이 없습니다:', {
          audioUrl,
          type,
          note: '녹음 및 업로드가 완료될 때까지 기다려주세요.',
        });
        alert('녹음 및 업로드가 완료될 때까지 기다려주세요.');
        return;
      }
      
      // audioUrl이 있지만 아직 제출이 완료되지 않은 경우 (SSE 대기 중)
      // RecordAnswer에서 자동으로 제출되므로 여기서는 아무것도 하지 않음
      // 로그는 최소화 (이미 제출된 경우는 위에서 처리됨)
      return;
    }

    // 텍스트 답변인 경우에만 제출
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
    // feedbackId를 저장하고 버튼을 활성화 상태로 유지 (피드백으로 이동 가능하도록)
    if (alreadySubmitted) {
      setIsAlreadySubmitted(true); // 제출 상태 플래그 설정
      if (feedbackId) {
        setSubmittedFeedbackId(feedbackId); // feedbackId 저장
        console.log('✅ [AnsweringSection] 이미 제출 완료 - feedbackId 저장:', {
          audioUrl,
          text,
          alreadySubmitted,
          feedbackId,
          note: '버튼 클릭 시 피드백 페이지로 이동할 수 있습니다.',
        });
        // 자동으로 피드백 페이지로 이동하지 않고, 버튼 클릭 시 이동하도록 함
        // navigate(generatePath(ROUTE_PATH.FEEDBACK, { id: String(feedbackId) }));
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

    // ⚠️ 음성 답변은 RecordAnswer에서 이미 제출했으므로 여기서는 제출하지 않음
    // handleAnswerComplete는 RecordAnswer에서 이미 제출된 경우에만 호출되므로
    // 여기서 추가 제출을 하지 않음
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
            // 이미 제출된 경우 버튼 활성화 (피드백으로 이동 가능)
            isAlreadySubmitted && submittedFeedbackId
              ? false
              : isSubmitting ||
                (type === 'text' && answerText.trim() === '') ||
                (type === 'voice' && (!audioUrl || audioUrl.trim() === '')) // 음성 답변은 audioUrl이 있어야 활성화
          }
        >
          {isAlreadySubmitted && submittedFeedbackId
            ? '피드백 확인' // 이미 제출된 경우 피드백 확인 버튼
            : type === 'voice' && audioUrl
              ? '피드백 확인' // 음성 답변 업로드 완료 후 피드백 확인 버튼 (제출 대기 중)
              : isSubmitting
                ? '제출 중...'
                : '답변 완료'}
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
