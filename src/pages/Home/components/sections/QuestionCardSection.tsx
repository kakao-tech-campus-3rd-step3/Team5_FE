import styled from '@emotion/styled';

import GlassBackground from '../../../../shared/components/GlassBackground/GlassBackground';

import type { AnswerStateType, Question } from '../../Home';

interface QuestionCardSectionProps {
  answerState: AnswerStateType;
  question: Question | null;
}

const QuestionCardSection = ({ answerState, question }: QuestionCardSectionProps) => {
  if (!question) return null;

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
