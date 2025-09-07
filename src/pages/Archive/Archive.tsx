import styled from '@emotion/styled';
import usePolygonAnimation from './hooks/usePolygonAnimation';
import { pinnedDatas } from './datas/pinnedDatas';

const ArchivePage = () => {
  const { pinnedItemWrapperRef, pinnedItemRefs } = usePolygonAnimation();

  return (
    <Wrapper>
      <SectionFirst>
        <DescriptionWrapper>
          <Title>나의 아카이브</Title>
          <SubTitle>겹겹이 쌓인 당신의 노력을 확인하세요!</SubTitle>
          <Pinned>
            <SubTitle>Pinned</SubTitle>
          </Pinned>
        </DescriptionWrapper>

        <PinnedItemWrapper ref={pinnedItemWrapperRef}>
          {pinnedDatas.map((data, i) => (
            <PinnedItem
              key={data.id}
              ref={(pinnedItemRef: HTMLDivElement) => {
                pinnedItemRefs.current[i] = pinnedItemRef;
              }}
            >
              {data.question}
            </PinnedItem>
          ))}
        </PinnedItemWrapper>
      </SectionFirst>
    </Wrapper>
  );
};

export default ArchivePage;

const PinnedItem = styled.div`
  position: absolute;
  width: 100px;
  height: 200px;
  background: rgba(255, 99, 71, 1);
  border-radius: 12px;
`;

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

const DescriptionWrapper = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PinnedItemWrapper = styled.div`
  position: absolute;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const SubTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
`;

const Pinned = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 28px;
  padding: 0 22px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 1000px;
`;
