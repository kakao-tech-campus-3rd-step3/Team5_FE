import type { AnswerType } from '../Home';
import RecordAnswer from './RecordAnswer';
import TextAnswer from './TextAnswer';
import Timer from './Timer';

interface AnswerSectionProps {
  type: AnswerType;
  isActive: boolean;
  onAnswerDone: () => void;
}

const AnswerSection = ({ type, isActive, onAnswerDone }: AnswerSectionProps) => {
  if (!isActive) return;
  return (
    <section>
      <Timer isActive={isActive} onAnswerDone={onAnswerDone}/>
      {type === 'voice' && <RecordAnswer />}
      {type === 'text' && <TextAnswer />}
    </section>
  );
};

export default AnswerSection;
