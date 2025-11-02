import styled from '@emotion/styled';
import { generatePath, useNavigate } from 'react-router-dom';

import { ROUTE_PATH } from '../../../routes/routePath';
import useFetch from '../../../shared/hooks/useFetch';
import usePolygonAnimation from '../hooks/usePolygonAnimation';

import type { AnswerItem, AnswersApiResponse } from '../Archive';

const PinnedQuestionList = () => {
  const navigate = useNavigate();
  const { pinnedItemWrapperRef, pinnedItemRefs } = usePolygonAnimation();
  const { data } = useFetch<AnswersApiResponse>('/api/answers', { params: { starred: true } });

  const items = data?.items;

  const handleItemClick = (id: number) => {
    navigate(generatePath(ROUTE_PATH.FEEDBACK_DETAIL, { id: String(id) }));
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
