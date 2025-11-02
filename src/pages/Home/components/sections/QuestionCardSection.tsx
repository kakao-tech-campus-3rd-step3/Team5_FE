import styled from '@emotion/styled';

import GlassBackground from '../../../../shared/components/GlassBackground/GlassBackground';
//import useFetch from '../../../../shared/hooks/useFetch';

import type { AnswerStateType } from '../../Home';

interface QuestionCardSectionProps {
  answerState: AnswerStateType;
}

interface Question {
  questionId: number;
  questionType: string;
  flowPhase: string;
  questionText: string;
  jobId: number;
}

const QuestionCardSection = ({ answerState, user, question }: QuestionCardSectionProps) => {
  // const { data: question } = useFetch<Question>('/api/questions/random');
  const questionText =
    answerState === 'before-answer'
      ? '오늘의 질문을 확인하세요!'
      : question?.content || '질문을 불러오는 중...';

  const welcomeMessage = user ? `${user.name}님,` : '';

  if (!question) return null;

  return (
    <section>
      <QuestionCard isStarted={answerState === 'answering'}>
        <GlassBackground>
          {welcomeMessage} {questionText}
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
