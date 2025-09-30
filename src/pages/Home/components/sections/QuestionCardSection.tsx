import styled from '@emotion/styled';
import type { AnswerStateType } from '../../Home';
import useQuestion from '../../hooks/useQuestion';
import GlassBackground from '../../../../shared/components/GlassBackground/GlassBackground';

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
