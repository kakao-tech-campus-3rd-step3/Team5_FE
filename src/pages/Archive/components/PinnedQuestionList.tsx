import styled from '@emotion/styled';
import usePolygonAnimation from '../hooks/usePolygonAnimation';

const PinnedQuestionList = ({ data }: any) => {
  const { pinnedItemWrapperRef, pinnedItemRefs } = usePolygonAnimation();
  const items = data?.items?.filter((q: any) => q.starred);
  if (!items) return;
  return (
    <PinnedItemWrapper ref={pinnedItemWrapperRef}>
      {items.map((data: any, i: any) => (
        <PinnedItem
          key={data.answerId}
          ref={(pinnedItemRef: HTMLDivElement) => {
            pinnedItemRefs.current[i] = pinnedItemRef;
          }}
        >
          <ItemText>{data.questionText}</ItemText>
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
