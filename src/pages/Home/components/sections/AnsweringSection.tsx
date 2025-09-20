import AnswerButton from '../../../../shared/ui/SharedButton';
import type { AnswerStateType, AnswerType } from '../../Home';
import AnswerInput from '../AnswerInput';

interface AnsweringSectionProps {
  type: AnswerType;
  answerState: AnswerStateType;
  onAnswerDone: () => void;
}

const AnsweringSection = ({ type, answerState, onAnswerDone }: AnsweringSectionProps) => {
  return (
    <section>
      <AnswerInput type={type} isActive={answerState === 'answering'} onAnswerDone={onAnswerDone} />
      <AnswerButton type="button" onClick={onAnswerDone} disabled={!type}>
        답변 완료
      </AnswerButton>
    </section>
  );
};

export default AnsweringSection;
