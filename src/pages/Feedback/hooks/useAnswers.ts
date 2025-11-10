import { useNavigate, useParams } from 'react-router-dom';

import useFetch from '../../../shared/hooks/useFetch';
import type { FeedbackDetailResponse, Feedback } from '../Feedback';

export const useAnswers = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isValidId = id && id !== ':id' && !isNaN(Number(id)) && Number(id) > 0;

  if (!isValidId && id) {
    console.error('❌ [FeedbackPage] 유효하지 않은 ID:', id);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }

  const answerUrl = isValidId ? `/api/answers/${id}` : null; 
  const feedbackUrl = isValidId ? `/api/feedback/${id}` : null;
  const { data, loading: answerLoading } = useFetch<FeedbackDetailResponse>(answerUrl);

  const { data: feedback, loading: feedbackLoading } = useFetch<Feedback>(feedbackUrl);

  return {
    id: isValidId ? id : undefined,
    data,
    feedback,
    question: data?.question, 
    isLoading: answerLoading || feedbackLoading, 
  };

};
