import styled from '@emotion/styled';
import { Loader2 } from 'lucide-react';

import GlassBackground from '../../../../shared/components/GlassBackground/GlassBackground';

import type { AnswerStateType, Question } from '../../Home';

interface QuestionCardSectionProps {
  answerState: AnswerStateType;
  question: Question | null;
  isLoading?: boolean;
}

const QuestionCardSection = ({ answerState, question, isLoading = false }: QuestionCardSectionProps) => {
  return (
    <section>
      <QuestionCard isStarted={answerState === 'answering'}>
        <GlassBackground>
          {isLoading ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>질문을 불러오는 중...</LoadingText>
            </LoadingContainer>
          ) : question ? (
            answerState === 'before-answer' ? '오늘의 질문을 확인하세요!' : question.questionText
          ) : (
            <ErrorText>질문을 불러올 수 없습니다.</ErrorText>
          )}
        </GlassBackground>
      </QuestionCard>
    </section>
  );
};

export default QuestionCardSection;

const QuestionCard = styled.div<{ isStarted: boolean }>`
  width: 300px;
  height: 300px;
  margin-bottom: 0;

  transition: 0.3s ease-in-out;
  animation: fadeInUp 0.6s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  height: 100%;
`;

const Spinner = styled(Loader2)`
  width: 48px;
  height: 48px;
  color: ${({ theme }) => theme.colors.pointCoral || theme.colors.secondary};
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textBrown};
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: #ef4444;
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;
