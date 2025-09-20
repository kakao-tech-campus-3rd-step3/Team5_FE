import type { AnswerType } from '../Home';
import TextInput from './TextInput';
import Timer from './Timer';
import VoiceInput from './VoiceInput';

interface AnswerInputProps {
  type: AnswerType;
  isActive: boolean;
  onAnswerDone: () => void;
}

const AnswerInput = ({ type, isActive, onAnswerDone }: AnswerInputProps) => {
  if (!isActive) return;
  return (
    <>
      <Timer isActive={isActive} onAnswerDone={onAnswerDone} />
      {type === 'voice' && <VoiceInput />}
      {type === 'text' && <TextInput />}
    </>
  );
};

export default AnswerInput;
