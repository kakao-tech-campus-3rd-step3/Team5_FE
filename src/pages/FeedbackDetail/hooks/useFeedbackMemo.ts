import { useEffect, useState } from 'react';
import type { AnswerPayload } from '../FeedbackDetail';

interface useFeedbackMemoProps {
  memo?: string;
  patchData: (payload: AnswerPayload) => Promise<AnswerPayload>;
}

const useFeedbackMemo = ({ memo, patchData }: useFeedbackMemoProps) => {
  const [memoContent, setMemoContent] = useState('');

  useEffect(() => {
    if (memo !== undefined && memo !== memoContent) setMemoContent(memo);
  }, [memo, memoContent]);

  const handleSaveMemo = async () => {
    const payload: AnswerPayload = {
      memo: memoContent,
    };

    try {
      const responseData = await patchData(payload);
      alert(`수정 완료: ${responseData.memo}`);
    } catch (error) {
      alert('수정 실패');
      console.error(error);
    }
  };
  return { memoContent, setMemoContent, handleSaveMemo };
};

export default useFeedbackMemo;
