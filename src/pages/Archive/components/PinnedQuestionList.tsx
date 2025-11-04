import styled from '@emotion/styled';

import usePinnedQuestions from '../hooks/usePinnedQuestions';

import type { AnswerItem } from '../Archive';

const PinnedQuestionList = () => {
  const { items, pinnedItemWrapperRef, getItemRef, handleItemClick } = usePinnedQuestions();

  if (!items) return null;
  return (
    <PinnedItemWrapper ref={pinnedItemWrapperRef}>
      {items.map((data: AnswerItem, i: number) => (
        <PinnedItem
          key={data.answerId}
          ref={getItemRef(i)}
          onClick={() => handleItemClick(data.answerId)}
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
