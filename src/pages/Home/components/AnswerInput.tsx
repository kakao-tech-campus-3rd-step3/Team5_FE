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
  userDefinedTime?: number;
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
  userDefinedTime,
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
    // ⚠️ 중요: onAnswerComplete만 호출하고, onAnswerDone은 호출하지 않음
    // AnsweringSection의 handleAnswerComplete에서 이미 제출 여부를 확인하고 처리함
    // 여기서 onAnswerDone을 호출하면 중복 제출이 발생함
    if (onAnswerComplete) {
      onAnswerComplete(audioUrl, text, alreadySubmitted, feedbackId);
    }
  };
  if (userDefinedTime === undefined) {
    userDefinedTime = 120;
  }

  return (
    <>
      <Timer isActive={isActive} onAnswerDone={onAnswerDone} userDefinedTime={userDefinedTime} />
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
