import styled from '@emotion/styled';

import usePinnedQuestions from '../hooks/usePinnedQuestions';

import type { AnswerItem } from '../Archive';

const PinnedQuestionList = () => {
  const { items, pinnedItemWrapperRef, getItemRef, handleItemClick } = usePinnedQuestions();

  if (!items || items.length === 0) {
    return <EmptyMessage>즐겨찾기를 추가해 주세요</EmptyMessage>;
  }
  return (
    <PinnedItemWrapper ref={pinnedItemWrapperRef}>
      {items.map((data: AnswerItem, i: number) => (
        <PinnedItem
          key={data.answerId}
          ref={getItemRef(i)}
          onDoubleClick={() => handleItemClick(data.answerId)}
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
  width: 110px;
  height: 200px;
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

const EmptyMessage = styled.div`
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.radius.radius24};
  margin-top: ${({ theme }) => theme.space.space64};
  padding: ${({ theme }) => theme.space.space16} ${({ theme }) => theme.space.space16};
`;
