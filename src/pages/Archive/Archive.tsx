import styled from '@emotion/styled';
import Lottie from 'lottie-react';

import clickAnimation from '../../assets/lottie/clickIcon.json';

import Description from './components/Description';
import PinnedQuestionList from './components/PinnedQuestionList';
import QuestionList from './components/QuestionList';
import useSectionScroll from './hooks/useSectionScroll';

export interface AnswerItem {
  answerId: number;
  questionId: number;
  questionText: string;
  questionType: string;
  flowPhase: string | null;
  level: number;
  starred: boolean;
  createdAt?: string;
  answered_time?: string;
}

export interface AnswersApiResponse {
  items: AnswerItem[];
  nextId: number | null;
  nextCreatedAt: string | null;
  hasNext: boolean;
}

const ArchivePage = () => {
  const {
    refs: { sectionFirstRef, sectionSecondRef },
    handlers: { handleDownClick, handleUpClick },
  } = useSectionScroll();

  // const [showMode, setShowMode] = useState(false);

  return (
    <Wrapper>
      <SectionFirst ref={sectionFirstRef}>
        <Description />
        <PinnedWrapper>
          <Pinned>즐겨찾기</Pinned>
        </PinnedWrapper>
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
  background: rgba(255, 255, 255, 0.2);

  font-size: ${({ theme }) => theme.typography.fontSizes.bodys};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  padding: ${({ theme }) => theme.space.space4} ${({ theme }) => theme.space.space8};
  border-radius: ${({ theme }) => theme.radius.radius24};
`;

const PinnedWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.space8};

  width: auto;
  height: auto;
  padding: ${({ theme }) => theme.space.space8} ${({ theme }) => theme.space.space12};

  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: ${({ theme }) => theme.blurs.blur4};
  border-radius: ${({ theme }) => theme.radius.radius24};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
`;
