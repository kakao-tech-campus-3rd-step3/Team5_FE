import styled from '@emotion/styled';
import Description from './components/Description';
import PinnedQuestionList from './components/PinnedQuestionList';
import QuestionList from './components/QuestionList';
import useSectionScroll from './hooks/useSectionScroll';
import Lottie from 'lottie-react';
import clickAnimation from './assets/lottie/clickIcon.json';

const ArchivePage = () => {
  const {
    refs: { sectionFirstRef, sectionSecondRef },
    handlers: { handleDownClick, handleUpClick },
  } = useSectionScroll();
  return (
    <Wrapper>
      <SectionFirst ref={sectionFirstRef}>
        <Description />
        <Pinned>Pinned</Pinned>
        <ButtonWrapper>
          <ScrollButton type="button" onClick={handleDownClick}>
            down
          </ScrollButton>
          <LottieWrapper>
            <Lottie animationData={clickAnimation} loop autoplay />
          </LottieWrapper>
        </ButtonWrapper>
        <PinnedQuestionList />
      </SectionFirst>

      <SectionSecond ref={sectionSecondRef}>
        <QuestionList />
        <ButtonWrapper>
          <ScrollButton type="button" onClick={handleUpClick}>
            Up
          </ScrollButton>
          <LottieWrapper>
            <Lottie animationData={clickAnimation} loop autoplay />
          </LottieWrapper>
        </ButtonWrapper>
      </SectionSecond>
    </Wrapper>
  );
};

export default ArchivePage;

const Wrapper = styled.div`
  overflow: hidden;
  max-height: 100vh;
  height: 100%;
`;

const SectionFirst = styled.section`
  position: relative;
  height: 100vh;
  scroll-snap-align: start;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SectionSecond = styled.section`
  position: relative;
  height: 100vh;
  scroll-snap-align: start;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 110px;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

const Pinned = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 28px;
  background: rgba(255, 255, 255, 0.4);
  padding: 0 ${({ theme }) => theme.space.space24};
  border-radius: ${({ theme }) => theme.radius.radiusFull};
  backdrop-filter: ${({ theme }) => theme.blurs.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.bodys};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.space64};
`;
