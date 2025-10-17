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
}

const AnswerInput = ({ type, isActive, onAnswerDone, value, onChange }: AnswerInputProps) => {
  if (!isActive) return null;
  return (
    <>
      <Timer isActive={isActive} onAnswerDone={onAnswerDone} />
      {type === 'voice' && <VoiceInput />}
      {type === 'text' && <TextInput value={value} onChange={onChange} />}
    </>
  );
};

export default AnswerInput;
