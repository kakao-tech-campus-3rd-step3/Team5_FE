import styled from '@emotion/styled';
import AnswerTypeSelector from '../AnswerTypeSelector';
import AnswerButton from '../../../../shared/ui/SharedButton';
import type { AnswerType } from '../../Home';
import type { ChangeEvent } from 'react';

interface BeforeAnswerSectionProps {
  type: AnswerType;
  onAnswerTypeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAnswering: () => void;
}

const BeforeAnswerSection = ({
  type,
  onAnswerTypeChange,
  onAnswering,
}: BeforeAnswerSectionProps) => {
  return (
    <section>
      <Wrapper>
        <Text>답변 방식을 선택해주세요.</Text>
        <AnswerTypeSelector type={type} onAnswerTypeChange={onAnswerTypeChange} />
        <AnswerButton type="button" onClick={onAnswering} disabled={!type}>
          답변하기
        </AnswerButton>
      </Wrapper>
    </section>
  );
};

export default BeforeAnswerSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.space16};
`;
