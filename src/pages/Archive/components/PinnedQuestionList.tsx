import styled from '@emotion/styled';
import usePolygonAnimation from '../hooks/usePolygonAnimation';
import { pinnedDatas } from '../datas/pinnedDatas';

const PinnedQuestionList = () => {
  const { pinnedItemWrapperRef, pinnedItemRefs } = usePolygonAnimation();
  return (
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
  );
};

export default PinnedQuestionList;

const PinnedItemWrapper = styled.div`
  position: absolute;
`;

const PinnedItem = styled.div`
  position: absolute;
  width: 100px;
  height: 200px;
  background: rgba(255, 99, 71, 1);
  border-radius: 12px;
`;
