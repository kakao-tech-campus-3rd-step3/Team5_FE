import type { ChangeEvent } from 'react';

import RecordAnswer from './RecordAnswer';
import TextInput from './TextInput';
import Timer from './Timer';

import type { AnswerType } from '../Home';

interface AnswerInputProps {
  type: AnswerType;
  isActive: boolean;
  onAnswerDone: () => void;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onAudioUrlChange?: (url: string) => void;
  onAnswerComplete?: (
    audioUrl: string,
    text?: string,
    alreadySubmitted?: boolean,
    feedbackId?: number
  ) => void;
  onError?: (error: string) => void;
  questionId?: number;
  answerText?: string;
  followUp?: boolean;
}

const AnswerInput = ({
  type,
  isActive,
  onAnswerDone,
  value,
  onChange,
  onAudioUrlChange,
  onAnswerComplete,
  onError,
  questionId,
  answerText,
  followUp,
}: AnswerInputProps) => {
  if (!isActive) return null;

  // RecordAnswer 완료 시 처리
  const handleAnswerComplete = (
    audioUrl: string,
    text?: string,
    alreadySubmitted?: boolean,
    feedbackId?: number
  ) => {
    if (onAudioUrlChange) {
      onAudioUrlChange(audioUrl);
    }
    if (onAnswerComplete) {
      onAnswerComplete(audioUrl, text, alreadySubmitted, feedbackId);
    }
    // 이미 제출된 경우에는 onAnswerDone을 호출하지 않음 (중복 제출 방지)
    if (!alreadySubmitted) {
      // 자동으로 답변 완료 처리
      onAnswerDone();
    }
  };

  return (
    <>
      <Timer isActive={isActive} onAnswerDone={onAnswerDone} />
      {type === 'voice' && (
        <RecordAnswer
          questionId={questionId}
          answerText={answerText || value}
          onAnswerComplete={handleAnswerComplete}
          onError={onError}
          onAudioUrlChange={onAudioUrlChange}
          followUp={followUp}
        />
      )}
      {type === 'text' && <TextInput value={value} onChange={onChange} />}
    </>
  );
};

export default AnswerInput;
