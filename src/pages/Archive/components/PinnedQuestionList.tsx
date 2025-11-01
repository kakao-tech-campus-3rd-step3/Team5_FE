import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { ROUTE_PATH } from '../../../routes/routePath';
import usePolygonAnimation from '../hooks/usePolygonAnimation';

import type { AnswerItem, AnswersApiResponse } from '../Archive';

interface PinnedQuestionListProps {
  data: AnswersApiResponse | null;
}

const PinnedQuestionList = ({ data }: PinnedQuestionListProps) => {
  const navigate = useNavigate();
  const { pinnedItemWrapperRef, pinnedItemRefs } = usePolygonAnimation();
  const items = data?.items?.filter((q: AnswerItem) => q.starred);

  const handleItemClick = () => {
    // TODO: id 값에 따라 동적라우팅 구현
    navigate(ROUTE_PATH.FEEDBACK_DETAIL);
  };

  if (!items) return null;
  return (
    <PinnedItemWrapper ref={pinnedItemWrapperRef}>
      {items.map((data: AnswerItem, i: number) => (
        <PinnedItem
          key={data.answerId}
          ref={(pinnedItemRef: HTMLDivElement) => {
            pinnedItemRefs.current[i] = pinnedItemRef;
          }}
          onClick={handleItemClick}
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
