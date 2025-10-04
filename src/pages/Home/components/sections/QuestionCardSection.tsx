import styled from '@emotion/styled';
import type { AnswerStateType } from '../../Home';
import GlassBackground from '../../../../shared/components/GlassBackground/GlassBackground';
import useFetch from '../../../../shared/hooks/useFetch';

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

const QuestionCardSection = ({ answerState }: QuestionCardSectionProps) => {
  // const { question } = useQuestion();
  const { data: question } = useFetch<Question>('/api/questions/random', {
    params: { user_id: 1 },
  });

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
