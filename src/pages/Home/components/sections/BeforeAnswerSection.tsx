import styled from '@emotion/styled';
import AnswerTypeSelector from '../AnswerTypeSelector';
import AnswerButton from '../../../../shared/ui/SharedButton';
import type { AnswerType } from '../../Home';

interface BeforeAnswerSectionProps {
  type: AnswerType;
  onAnswerType: (type: AnswerType) => void;
  onAnswering: () => void;
}

const BeforeAnswerSection = ({ type, onAnswerType, onAnswering }: BeforeAnswerSectionProps) => {
  return (
    <section>
      <AnswerTypeSelector type={type} onAnswerType={onAnswerType} />
      <AnswerButton type="button" onClick={onAnswering} disabled={!type}>
        답변하기
      </AnswerButton>
    </section>
  );
};

export default BeforeAnswerSection;
