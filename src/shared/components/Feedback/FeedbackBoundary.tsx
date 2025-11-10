import styled from '@emotion/styled';
import Lottie from 'lottie-react';

import LoadingAnimation from '../../../assets/lottie/loading3.json';
import type { Feedback } from '../../../pages/FeedbackDetail/FeedbackDetail';

interface FeedbackBoundaryProps {
  data: Feedback | string | undefined;
  children: React.ReactNode;
}

const FeedbackBoundary = ({ data, children }: FeedbackBoundaryProps) => {
  const isLoading = !data;

  if (isLoading) {
    return (
      <LottieWrapper>
        <Lottie animationData={LoadingAnimation} loop autoplay />
      </LottieWrapper>
    );
  }

  return <>{children}</>;
};

export default FeedbackBoundary;

const LottieWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 170px;
  height: auto;
  pointer-events: none;
`;
