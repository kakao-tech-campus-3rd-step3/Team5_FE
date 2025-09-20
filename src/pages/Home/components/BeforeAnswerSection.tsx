import styled from '@emotion/styled';
import AnswerTypeSelector from './AnswerTypeSelector';
import AnswerButton from '../../../components/Button/AnswerButton';
import type { AnswerType } from '../Home';

interface BeforeAnswerSectionProps {
  type: AnswerType;
  onAnswerType: (type: AnswerType) => void;
  onAnswerState: () => void;
}

const BeforeAnswerSection = ({ type, onAnswerType, onAnswerState }: BeforeAnswerSectionProps) => {
  return (
    <section>
      <AnswerTypeSelector type={type} onAnswerType={onAnswerType} />
      <AnswerButton type="button" onClick={onAnswerState} disabled={!type}>
        답변하기
      </AnswerButton>
    </section>
  );
};

export default BeforeAnswerSection;
