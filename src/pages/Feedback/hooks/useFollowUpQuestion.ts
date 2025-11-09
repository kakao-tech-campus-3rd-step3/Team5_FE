import { useState } from 'react';
import apiClient from '../../../api/apiClient';

interface IFollowUpPayload {
  message: string;
  generatedCount: number;
}
interface IFollowUpResponse {
  nextQuestionId: number;
  questionText: string;
}

const useFollowUpQuestion = (id: string) => {
  const [followUpQuestion, setFollowUpQuestion] = useState<IFollowUpResponse | null>(null);
  const [followedQLoading, setFollowedQLoading] = useState(false);

  const [answer, setAnswer] = useState('');

  const handleRequestFollowUp = async () => {
    const payload: IFollowUpPayload = {
      message: answer,
      generatedCount: 1,
    };

    setFollowedQLoading(true);

    try {
      const response = await apiClient.post<IFollowUpResponse>(
        `api/questions/followUp/${id}`,
        payload
      );

      setFollowUpQuestion(response.data);
      console.log('요청 성공:', response.data);
      setAnswer('');
    } catch (err) {
      console.error('요청 실패:', err);
    } finally {
      setFollowedQLoading(false);
    }
  };

  return {
    followUpQuestion,
    followedQLoading,
    handleRequestFollowUp,
  };
};

export default useFollowUpQuestion;
