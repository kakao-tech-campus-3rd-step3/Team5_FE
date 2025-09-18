import AnswerButton from '../../../components/Button/AnswerButton';
import type { AnswerType } from '../Home';
import AnswerSection from './AnswerSection';
interface AnsweringSectionProps {
  type: AnswerType;
  isStarted: boolean;
  onAnswerDone: () => void;
}

const AnsweringSection = ({ type, isStarted, onAnswerDone }: AnsweringSectionProps) => {
  return (
    <>
      <AnswerSection type={type} isActive={isStarted} onAnswerDone={onAnswerDone} />
      <AnswerButton type="button" onClick={onAnswerDone} disabled={!type}>
        답변 완료
      </AnswerButton>
    </>
  );
};

export default AnsweringSection;
