import styled from '@emotion/styled';
import Lottie from 'lottie-react';

import LoadingAnimation from '../../../../assets/lottie/loading3.json';

import type { AnswerStateType, Question } from '../../Home';

interface QuestionCardSectionProps {
  answerState: AnswerStateType;
  question: Question | null;
}

const QuestionCardSection = ({ answerState, question }: QuestionCardSectionProps) => {
  if (!question)
    return (
      <QuestionCard>
        <QuestionGlassCard>
          <LottieWrapper>
            <Lottie animationData={LoadingAnimation} loop autoplay />
          </LottieWrapper>
        </QuestionGlassCard>
      </QuestionCard>
    );

  return (
    <section>
      <QuestionCard>
        <QuestionGlassCard>
          {answerState === 'before-answer'
            ? question?.followUp
              ? '꼬리 질문을 확인하세요'
              : '오늘의 질문을 확인하세요!'
            : question.questionText}
        </QuestionGlassCard>
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

const QuestionGlassCard = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(255, 255, 255, 0.2);

  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);

  width: 100%;
  height: 100%;
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  font-size: ${({ theme }) => theme.typography.fontSizes.h4};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  text-align: center;
  line-height: 1.6;

  transition: all 0.3s ease;

  &:hover {
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      inset 0 -1px 0 rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const LottieWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 170px;
  height: auto;
  pointer-events: none;
`;
