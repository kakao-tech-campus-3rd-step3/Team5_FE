import type { AnswerType } from '../Home';
import RecordAnswer from './RecordAnswer';
import TextAnswer from './TextAnswer';
import Timer from './Timer';

interface AnswerInputProps {
  type: AnswerType;
  isActive: boolean;
  onAnswerDone: () => void;
}

const AnswerInput = ({ type, isActive, onAnswerDone }: AnswerInputProps) => {
  if (!isActive) return;
  return (
    <>
      <Timer isActive={isActive} onAnswerDone={onAnswerDone}/>
      {type === 'voice' && <RecordAnswer />}
      {type === 'text' && <TextAnswer />}
    </>
  );
};

export default AnswerInput;
