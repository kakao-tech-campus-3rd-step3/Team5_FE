import type { AnswerType } from '../Home';
import TextInput from './TextInput';
import Timer from './Timer';
import VoiceInput from './VoiceInput';
import type { ChangeEvent } from 'react';

interface AnswerInputProps {
  type: AnswerType;
  isActive: boolean;
  onAnswerDone: () => void;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onAudioUrlChange?: (url: string) => void;
}

const AnswerInput = ({ type, isActive, onAnswerDone, value, onChange, onAudioUrlChange }: AnswerInputProps) => {
  if (!isActive) return null;
  return (
    <>
      <Timer isActive={isActive} onAnswerDone={onAnswerDone} />
      {type === 'voice' && <VoiceInput onAudioUrlChange={onAudioUrlChange} />}
      {type === 'text' && <TextInput value={value} onChange={onChange} />}
    </>
  );
};

export default AnswerInput;
