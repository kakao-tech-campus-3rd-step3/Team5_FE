import { useEffect, useState } from 'react';

import type { AnswerPayload } from '../Feedback';

interface useFeedbackMemoProps {
  memo: string | undefined;
  patchData: (payload: AnswerPayload) => Promise<unknown>;
}

export const useFeedbackMemo = ({ memo, patchData }: useFeedbackMemoProps) => {
  const [memoContent, setMemoContent] = useState('');

  useEffect(() => {
    if (memo !== undefined) {
      setMemoContent(memo || '');
    }
  }, [memo]);

  const handleSaveMemo = async () => {
    const payload: AnswerPayload = {
      memo: memoContent,
    };

    try {
      await patchData(payload);
      alert('메모가 저장되었습니다.');
    } catch (e) {
      alert('메모 저장에 실패했습니다. 다시 시도해주세요.');
      console.error(e);
    }
  };

  return { memoContent, setMemoContent, handleSaveMemo };
};
