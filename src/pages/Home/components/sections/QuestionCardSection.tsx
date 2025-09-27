import styled from '@emotion/styled';
import type { AnswerStateType } from '../../Home';
import useQuestion from '../../hooks/useQuestion';
interface QuestionCardSectionProps {
  answerState: AnswerStateType;
}

const QuestionCardSection = ({ answerState }: QuestionCardSectionProps) => {
  const { question } = useQuestion();

  return (
    <section>
      <QuestionCard isStarted={answerState === 'answering'}>
        <GlassBackground>
          {answerState === 'before-answer' ? '오늘의 질문을 확인하세요!' : question.questionText}
        </GlassBackground>
      </QuestionCard>
    </section>
  );
};

export default QuestionCardSection;

const QuestionCard = styled.div<{ isStarted: boolean }>`
  width: 300px;
  height: 300px;
  margin-bottom: ${({ theme }) => theme.space.space16};

  transition: 0.3s ease-in-out;
`;

const GlassBackground = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: ${({ theme }) => theme.blurs.blur8};
  border-radius: ${({ theme }) => theme.radius.radius24};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;
