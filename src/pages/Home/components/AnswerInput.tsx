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
  onAnswerComplete?: (audioUrl: string, text?: string) => void;
  onError?: (error: string) => void;
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
}: AnswerInputProps) => {
  if (!isActive) return null;

  // RecordAnswer 완료 시 처리
  const handleAnswerComplete = (audioUrl: string, text?: string) => {
    if (onAudioUrlChange) {
      onAudioUrlChange(audioUrl);
    }
    if (onAnswerComplete) {
      onAnswerComplete(audioUrl, text);
    }
    // 자동으로 답변 완료 처리
    onAnswerDone();
  };

  return (
    <>
      <Timer isActive={isActive} onAnswerDone={onAnswerDone} />
      {type === 'voice' && (
        <RecordAnswer onAnswerComplete={handleAnswerComplete} onError={onError} />
      )}
      {type === 'text' && <TextInput value={value} onChange={onChange} />}
    </>
  );
};

export default AnswerInput;
