import { useEffect, useState } from 'react';
import type { AnswerPayload } from '../Feedback';

interface useStarredProps {
  starred: boolean | undefined;
  patchData: (payload: AnswerPayload) => Promise<unknown>;
}

export const useStarred = ({ starred, patchData }: useStarredProps) => {
  const [isStarred, setIsStarred] = useState<boolean>();

  useEffect(() => {
    setIsStarred(starred);
  }, [starred]);

  const handleStarredChange = async (newStarredState: boolean) => {
    const payload: AnswerPayload = {
      starred: newStarredState,
    };

    try {
      await patchData(payload);
      setIsStarred(newStarredState);
    } catch (e) {
      alert('오류가 발생했습니다.');
      console.error(e);
    }
  };

  return { isStarred, handleStarredChange };
};
