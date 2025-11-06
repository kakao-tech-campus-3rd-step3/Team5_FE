import styled from '@emotion/styled';
import Lottie from 'lottie-react';

import LoadingAnimation from '../../../../assets/lottie/loading.json';
import GlassBackground from '../../../../shared/components/GlassBackground/GlassBackground';

import type { AnswerStateType, Question } from '../../Home';

interface QuestionCardSectionProps {
  answerState: AnswerStateType;
  question: Question | null;
}

const QuestionCardSection = ({ answerState, question }: QuestionCardSectionProps) => {
  if (!question)
    return (
      <QuestionCard>
        <GlassBackground>
          <LottieWrapper>
            <Lottie animationData={LoadingAnimation} loop autoplay />
          </LottieWrapper>
        </GlassBackground>
      </QuestionCard>
    );

  return (
    <section>
      <QuestionCard>
        <GlassBackground>
          {answerState === 'before-answer'
            ? // 1. question.followUp이 null/undefined가 아니면 그 값을 사용하고,
              // 2. null/undefined라면 '오늘의 질문을 확인하세요!'를 사용합니다.
              question?.followUp
              ? '꼬리 질문을 확인하세요'
              : '오늘의 질문을 확인하세요!'
            : // answerState가 'before-answer'가 아니면(e.g., 'answering')
              // question.questionText를 보여줍니다.
              question.questionText}
        </GlassBackground>
      </QuestionCard>
    </section>
  );
};

export default QuestionCardSection;

const QuestionCard = styled.div`
  width: 300px;
  height: 300px;
  margin-bottom: ${({ theme }) => theme.space.space16};

  transition: 0.3s ease-in-out;
`;

const LottieWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  pointer-events: none;
`;
