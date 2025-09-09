import styled from '@emotion/styled';
import Description from './components/Description';
import PinnedQuestionList from './components/PinnedQuestionList';
import QuestionList from './components/QuestionList';
import useSectionScroll from './hooks/useSectionScroll';

const ArchivePage = () => {
  const {
    refs: { sectionFirstRef, sectionSecondRef },
    handlers: { handleDownClick, handleUpClick },
  } = useSectionScroll();
  return (
    <Wrapper>
      <SectionFirst ref={sectionFirstRef}>
        <Description />
        <ScrollDownButton onClick={handleDownClick}>Down</ScrollDownButton>
        <PinnedQuestionList />
      </SectionFirst>

      <SectionSecond ref={sectionSecondRef}>
        <QuestionList />
        <ScrollUpButton onClick={handleUpClick}>Up</ScrollUpButton>
      </SectionSecond>
    </Wrapper>
  );
};

export default ArchivePage;

const Wrapper = styled.div`
  overflow: hidden;
  height: 100vh;
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

  background: linear-gradient(
    180deg,
    rgba(247, 151, 30, 0.3) 14.9%,
    rgba(239, 108, 87, 0.4) 52.4%,
    rgba(255, 200, 44, 0.3) 100%
  );
`;

const SectionSecond = styled.section`
  height: 100vh;
  scroll-snap-align: start;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ff6d6d;
`;

const ScrollDownButton = styled.button``;

const ScrollUpButton = styled.button``;
