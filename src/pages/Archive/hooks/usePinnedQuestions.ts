import { generatePath, useNavigate } from 'react-router-dom';

import { ROUTE_PATH } from '../../../routes/routePath';
import useFetch from '../../../shared/hooks/useFetch';

import usePolygonAnimation from './usePolygonAnimation';

import type { AnswersApiResponse } from '../Archive';

const usePinnedQuestions = () => {
  const navigate = useNavigate();
  const { pinnedItemWrapperRef, pinnedItemRefs } = usePolygonAnimation();
  const { data } = useFetch<AnswersApiResponse>('/api/answers', { params: { starred: true } });
  const items = data?.items;

  const handleItemClick = (id: number) => {
    navigate(generatePath(ROUTE_PATH.FEEDBACK_DETAIL, { id: String(id) }));
  };

  const getItemRef = (i: number) => (el: HTMLDivElement) => {
    if (el) {
      pinnedItemRefs.current[i] = el;
    }
  };

  return { items, pinnedItemWrapperRef, getItemRef, handleItemClick };
};

export default usePinnedQuestions;
