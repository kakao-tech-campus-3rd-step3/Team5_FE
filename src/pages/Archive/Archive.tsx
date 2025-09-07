import styled from '@emotion/styled';
import Description from './components/Description';
import PinnedItems from './components/PinnedItems';

const ArchivePage = () => {
  return (
    <Wrapper>
      <SectionFirst>
        <Description />
        <PinnedItems />
      </SectionFirst>
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
