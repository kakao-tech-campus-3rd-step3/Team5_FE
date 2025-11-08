import { useEffect, useState } from 'react';
import type { AnswerPayload } from '../FeedbackDetail';

interface useLevelProps {
  level: number;
  patchData: (payload: AnswerPayload) => Promise<AnswerPayload>;
}
const useLevel = ({ level, patchData }: useLevelProps) => {
  const [questionLevel, setQuestionLevel] = useState<number>(level);
  useEffect(() => {
    if (level !== undefined) {
      setQuestionLevel(level);
    }
  }, [level]);

  const handleLevelChange = async (level: number) => {
    const payload: AnswerPayload = {
      level: level,
    };

    try {
      await patchData(payload);
      setQuestionLevel(level);
    } catch (error) {
      alert('저장 실패');
      console.error(error);
    }
  };

  return { questionLevel, handleLevelChange };
};

export default useLevel;
