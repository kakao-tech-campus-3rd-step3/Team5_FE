import { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
// import useFetch from '../../../shared/hooks/useFetch';
import axios from 'axios';
import { generatePath, useNavigate } from 'react-router-dom';

import { ROUTE_PATH } from '../../../routes/routePath';

import type { AnswerItem, AnswersApiResponse } from '../Archive';

function InfiniteScrollList() {
  const navigate = useNavigate();

  const handleItemClick = (id: number) => {
    navigate(generatePath(ROUTE_PATH.FEEDBACK_DETAIL, { id: String(id) }));
  };

  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<AnswerItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    const el = loader.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loader, hasMore]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    // const { data } = useFetch<AnswersApiResponse>(`/api/answers/page=${page}`);
    const response = await axios.get<AnswersApiResponse>(`/api/answers`, {
      params: { page: page },
    });
    const items = response.data?.items;
    console.log(items?.length);

    if (items) {
      setItems((prev) => [...prev, ...items]);
      setPage((prev) => prev + 1);
    }

    if (items?.length === 0) setHasMore(false);
  };

  return (
    <>
      {items?.length > 0 ? (
        <ListItemWrapper>
          <ol>
            {items?.map((q: AnswerItem, index: number) => (
              <ListItem key={q.answerId} onClick={() => handleItemClick(q.answerId)}>
                {index + 1}. {q.questionText}
              </ListItem>
            ))}
          </ol>
          <div ref={loader} style={{ height: 1 }} />
        </ListItemWrapper>
      ) : (
        <ListItemWrapper>{!loading && <Wrapper>EMPTY</Wrapper>}</ListItemWrapper>
      )}
      <div ref={loader} style={{ height: 1 }} />
      {loading && <Wrapper>Loading...</Wrapper>}
    </>
  );
}

export default InfiniteScrollList;

const ListItemWrapper = styled.div`
  width: 90%;
  max-width: 900px;
  max-height: 70%;
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
