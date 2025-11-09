import type { FeedbackDetailResponse } from '../FeedbackDetail';
import useFetch from '../../../shared/hooks/useFetch';

const useAnswers = (id?: string) => {
  const path = id ? `/api/answers/${id}` : null;
  const { data } = useFetch<FeedbackDetailResponse>(path);
  const { question, feedback, memo, starred, level, answerText } = data || {};

  return { question, feedback, memo, starred, level, answerText };
};

export default useAnswers;
