import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTE_PATH } from '../../../routes/routePath';
import type { AnswerPayload } from '../Feedback';

interface useLevelProps {
  level: number | undefined;
  patchData: (payload: AnswerPayload) => Promise<unknown>;
}

export const useLevel = ({ level, patchData }: useLevelProps) => {
  const navigate = useNavigate();

  const [questionLevel, setQuestionLevel] = useState<number>(0);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  useEffect(() => {
    if (level !== undefined) {
      setQuestionLevel(level);
    }
  }, [level]);

  const handleModalClick = () => {
    setIsLevelModalOpen(true);
  };

  const handleLevelSaveAndNavigate = async (newLevel: number) => {
    const payload: AnswerPayload = { level: newLevel };

    if (newLevel === questionLevel) {
      navigate(ROUTE_PATH.ARCHIVE);
      return;
    }
    try {
      await patchData(payload);
      setQuestionLevel(newLevel);
      navigate(ROUTE_PATH.ARCHIVE);
    } catch (e) {
      alert('난이도 저장에 실패했습니다.');
      setIsLevelModalOpen(false);
    }
  };

  return {
    questionLevel,
    isLevelModalOpen,
    setIsLevelModalOpen,
    handleModalClick,
    handleLevelSaveAndNavigate,
  };
};
