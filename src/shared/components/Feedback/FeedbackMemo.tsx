import styled from '@emotion/styled';
import Card from '../../../pages/Feedback/components/Card';
import type { AnswerPayload } from '../../../pages/FeedbackDetail/FeedbackDetail';
import useFeedbackMemo from '../../../pages/FeedbackDetail/hooks/useFeedbackMemo';
import usePatch from '../../hooks/usePatch';

interface FeedbackMemoProps {
  id: string;
  memo?: string;
}

const FeedbackMemo = ({ id, memo }: FeedbackMemoProps) => {
  const { patchData } = usePatch<AnswerPayload, AnswerPayload>(`/api/answers/${id}`);
  const { memoContent, setMemoContent, handleSaveMemo } = useFeedbackMemo({ memo, patchData });

  return (
    <SectionContainer>
      <Title>메모</Title>
      <Card>
        <MemoCardContent>
          <MemoTextArea
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder="메모를 작성해주세요."
          />
          <MemoSaveButton type="button" onClick={handleSaveMemo} disabled={false}>
            메모 저장
          </MemoSaveButton>
        </MemoCardContent>
      </Card>
    </SectionContainer>
  );
};

export default FeedbackMemo;

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const MemoTextArea = styled.textarea`
  width: 90%;
  min-height: 120px;
  padding: ${({ theme }) => theme.space.space16};
  border-radius: ${({ theme }) => theme.radius.radius8};
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

const MemoSaveButton = styled.button`
  width: 90%;
  margin-top: ${({ theme }) => theme.space.space16};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MemoCardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 90%; /* ◀ Card의 높이를 꽉 채움 */

  padding: ${({ theme }) => theme.space.space24};
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.space.space24};
`;
