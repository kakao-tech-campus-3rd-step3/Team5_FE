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
          <ItemText>{data.question}</ItemText>
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
  width: 140px;
  height: 230px;
  background: rgba(255, 99, 71, 1);
  border-radius: 12px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemText = styled.div`
  font-weight: 700;
  transform: rotate(90deg);
`;
