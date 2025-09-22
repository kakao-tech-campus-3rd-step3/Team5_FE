// import styled from '@emotion/styled';
import AnswerTypeSelector from '../AnswerTypeSelector';
import AnswerButton from '../../../../shared/ui/SharedButton';
import type { AnswerType } from '../../Home';
import type { ChangeEvent } from 'react';

interface BeforeAnswerSectionProps {
  type: AnswerType;
  onAnswerTypeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAnswering: () => void;
}

const BeforeAnswerSection = ({ type, onAnswerTypeChange, onAnswering }: BeforeAnswerSectionProps) => {
  return (
    <section>
      <AnswerTypeSelector type={type} onAnswerTypeChange={onAnswerTypeChange} />
      <AnswerButton type="button" onClick={onAnswering} disabled={!type}>
        답변하기
      </AnswerButton>
    </section>
  );
};

export default BeforeAnswerSection;
