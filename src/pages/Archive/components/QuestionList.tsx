import styled from '@emotion/styled';
import Lottie from 'lottie-react';
import { generatePath, useNavigate } from 'react-router-dom';

import LoadingAnimation from '../../../assets/lottie/loading3.json';
import { ROUTE_PATH } from '../../../routes/routePath';
import type { AnswerItem } from '../Archive';
import FilterSelector from './FilterSelector';
import useInifiniteScroll from '../hooks/useInifiniteScroll';

const QuestionList = () => {
  const navigate = useNavigate();
  const { items, isLoading, lastItemRef } = useInifiniteScroll();

  const handleItemClick = (id: number) => {
    navigate(generatePath(ROUTE_PATH.FEEDBACK_DETAIL, { id: String(id) }));
  };

  return (
    <Wrapper>
      <FilterSelector />
      <ListItemWrapper>
        {items.length > 0 ? (
          <>
            <ol>
              {items.map((q: AnswerItem, index: number) => {
                if (items.length === index + 1) {
                  return (
                    <ListItem
                      ref={lastItemRef}
                      key={`${q.answerId}-${index}`}
                      onClick={() => handleItemClick(q.answerId)}
                    >
                      {index + 1}. {q.questionText}
                    </ListItem>
                  );
                }
                return (
                  <ListItem
                    key={`${q.answerId}-${index}`}
                    onClick={() => handleItemClick(q.answerId)}
                  >
                    {index + 1}. {q.questionText}
                  </ListItem>
                );
              })}
            </ol>
            {isLoading && (
              <LottieWrapper>
                <Lottie animationData={LoadingAnimation} loop autoplay />
              </LottieWrapper>
            )}
          </>
        ) : isLoading ? (
          <LottieWrapper>
            <Lottie animationData={LoadingAnimation} loop autoplay />
          </LottieWrapper>
        ) : (
          <Wrapper>EMPTY</Wrapper>
        )}
      </ListItemWrapper>
    </Wrapper>
  );
};

export default QuestionList;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;
  height: 100%;
  gap: ${({ theme }) => theme.space.space32};
  margin-bottom: ${({ theme }) => theme.space.space32};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const ListItemWrapper = styled.div`
  width: 90%;
  max-width: 900px;
  max-height: 50vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space.space16};

  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: ${({ theme }) => theme.blurs.blur4};
  border-radius: ${({ theme }) => theme.radius.radius24};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
`;

const ListItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSizes.bodys};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin: ${({ theme }) => theme.space.space12};
`;

const LottieWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 170px;
  height: auto;
  pointer-events: none;
`;
