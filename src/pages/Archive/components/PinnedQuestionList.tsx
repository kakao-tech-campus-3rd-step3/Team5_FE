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
  width: 130px;
  height: 230px;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.radius.radiusFull};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.bodys};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  transform: rotate(90deg);
`;
