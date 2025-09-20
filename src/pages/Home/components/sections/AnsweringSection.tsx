import AnswerButton from '../../../../components/Button/AnswerButton';
import type { AnswerStateType, AnswerType } from '../../Home';
import AnswerSection from '../AnswerInput';
interface AnsweringSectionProps {
  type: AnswerType;
  isStarted: AnswerStateType;
  onAnswerDone: () => void;
}

const AnsweringSection = ({ type, isStarted, onAnswerDone }: AnsweringSectionProps) => {
  return (
    <section>
      <AnswerSection type={type} isActive={isStarted === 'answering'} onAnswerDone={onAnswerDone} />
      <AnswerButton type="button" onClick={onAnswerDone} disabled={!type}>
        답변 완료
      </AnswerButton>
    </section>
  );
};

export default AnsweringSection;
