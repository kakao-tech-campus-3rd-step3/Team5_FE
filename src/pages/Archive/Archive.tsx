import styled from '@emotion/styled';
import Description from './components/Description';
import PinnedQuestionList from './components/PinnedQuestionList';
import QuestionList from './components/QuestionList';
import useSectionScroll from './hooks/useSectionScroll';
// import Lottie from 'lottie-react';
// import clickkAnimation from './assets/lottie/clickIcon.json';

const ArchivePage = () => {
  const {
    refs: { sectionFirstRef, sectionSecondRef },
    handlers: { handleDownClick, handleUpClick },
  } = useSectionScroll();
  return (
    <Wrapper>
      <SectionFirst ref={sectionFirstRef}>
        <Description />
        <ButtonWrapper>
          <ScrollDownButton type="button" onClick={handleDownClick}>
            down
          </ScrollDownButton>
        </ButtonWrapper>
        {/* <LottieWrapper> */}
        {/* <Lottie animationData={clickkAnimation} loop autoplay /> */}
        {/* </LottieWrapper> */}

        <PinnedQuestionList />
      </SectionFirst>

      <SectionSecond ref={sectionSecondRef}>
        <QuestionList />
        <ScrollUpButton type="button" onClick={handleUpClick}>
          Up
        </ScrollUpButton>
      </SectionSecond>
    </Wrapper>
  );
};

export default ArchivePage;

const Wrapper = styled.div`
  overflow: hidden;
  height: 100%;
`;

const SectionFirst = styled.section`
  position: relative;
  overflow: hidden;
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
  background-color: #ff6d6d;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translate(-50%, -50%);
`;

const ScrollDownButton = styled.button`
  width: 100%;
  height: 100%;
`;

const ScrollUpButton = styled.button`
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translate(-50%, -50%);
`;

// const LottieWrapper = styled.div`
//   position: absolute;
//   left: 50%;
//   bottom: 10%;
//   transform: translate(-50%, -50%);

//   // width: 80px;
//   // height: 80px;
// `;
