import type { AnswerType } from '../Home';
import RecordAnswer from './RecordAnswer';
import TextAnswer from './textAnswer';
import Timer from './Timer';

interface AnswerSectionProps {
  type: AnswerType;
  isActive: boolean;
}

const AnswerSection = ({ type, isActive }: AnswerSectionProps) => {
  if (!isActive) return;
  return (
    <section>
      <Timer isActive={isActive} />
      {type === 'voice' && <RecordAnswer />}
      {type === 'text' && <TextAnswer />}
    </section>
  );
};

export default AnswerSection;
