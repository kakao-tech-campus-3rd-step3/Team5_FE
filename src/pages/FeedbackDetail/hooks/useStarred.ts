import { useEffect, useState } from 'react';
import type { AnswerPayload } from '../FeedbackDetail';

interface useStarredProps {
  starred: boolean;
  patchData: (payload: AnswerPayload) => Promise<AnswerPayload>;
}

const useStarred = ({ starred, patchData }: useStarredProps) => {
  const [isStarred, setIsStarred] = useState<boolean>();

  useEffect(() => {
    setIsStarred(starred);
  }, [starred]);

  const handleStarredChange = async (starred: boolean) => {
    const payload: AnswerPayload = {
      starred: starred,
    };

    try {
      await patchData(payload);
      setIsStarred(starred);
    } catch (error) {
      alert('저장 실패');
      console.error(error);
    }
  };

  return { isStarred, handleStarredChange };
};

export default useStarred;
