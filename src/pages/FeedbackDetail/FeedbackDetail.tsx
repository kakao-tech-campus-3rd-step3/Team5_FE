import styled from '@emotion/styled';
import SharedButton from '../../shared/ui/SharedButton';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTE_PATH } from '../../routes/routePath';
import { useEffect, useState } from 'react';
import Card from '../Feedback/components/Card';
import useFetch from '../../shared/hooks/useFetch';
import usePatch from '../../shared/hooks/usePatch';

export interface Question {
  questionId: number;
  questionType: string;
  questionText: string;
}

export interface FeedbackContent {
  overallEvaluation: string;
  positivePoints: string[];
  pointsForImprovement: string[];
}

export interface Feedback {
  status: string;
  content: FeedbackContent;
  updatedAt: string;
}

export interface FeedbackDetailResponse {
  answerId: number;
  question: Question;
  answerText: string;
  memo: string;
  level: number;
  starred: boolean;
  createdAt: string;
  feedback: Feedback;
}

interface AnswerPayload {
  memo?: string;
  starred?: boolean;
  level?: number;
}

const FeedbackDetailPage = () => {
  const { id } = useParams();
  const { data } = useFetch<FeedbackDetailResponse>(`/api/answers/${id}`);

  const question = data?.question;
  const feedback = data?.feedback;
  console.log(data);

  const { patchData } = usePatch<AnswerPayload, AnswerPayload>(`/api/answers/${id}`);

  const navigate = useNavigate();

  const [memoContent, setMemoContent] = useState('');
  useEffect(() => {
    if (data?.memo !== undefined && data.memo !== memoContent) setMemoContent(data?.memo);
  }, [data?.memo]);
  console.log(memoContent);

  const handleArchiveClick = () => {
    navigate(ROUTE_PATH.ARCHIVE);
  };

  const handleSaveMemo = async () => {
    const payload: AnswerPayload = {
      memo: memoContent,
    };

    try {
      const responseData = await patchData(payload);
      alert(`수정 완료: ${responseData.memo}`);
    } catch (e) {
      alert;
    }
  };

  if (!data || !question || !feedback) return null;
  return (
    <Wrapper>
      <SectionContainer>
        {/* TODO: API 응답에 질문 텍스트가 포함되어 있는지 확인 후 연결*/}
        <QuestionText>{question.questionText}</QuestionText>
      </SectionContainer>

      <SectionContainer>
        <Title>나의 답변</Title>
        <Card>
          {/* {answerData.content.map((paragraph, index) => ( */}
          <CardParagraph>{data.answerText}</CardParagraph>
          {/* ))} */}
        </Card>
      </SectionContainer>

      <SectionContainer>
        <Title>AI 피드백</Title>

        <Card>
          <CardTitle>종합 평가</CardTitle>
          <CardParagraph>{feedback.content.overallEvaluation}</CardParagraph>
        </Card>

        <Card>
          <CardTitle>좋은 점</CardTitle>
          <CardList>
            {feedback.content.positivePoints.map((point, index) => (
              <CardListItem key={index}>{point}</CardListItem>
            ))}
          </CardList>
        </Card>

        <Card>
          <CardTitle>개선할 수 있는 점</CardTitle>
          <CardList>
            {feedback.content.pointsForImprovement.map((point, index) => (
              <CardListItem key={index}>{point}</CardListItem>
            ))}
          </CardList>
        </Card>
      </SectionContainer>

      <SectionContainer>
        <Title>메모</Title>
        <Card>
          <MemoTextArea
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder="메모를 작성해주세요."
          />
          <SharedButton type="button" onClick={handleSaveMemo} disabled={false}>
            메모 저장
          </SharedButton>
        </Card>
      </SectionContainer>

      <SharedButton type="button" onClick={handleArchiveClick} disabled={false}>
        아카이브로 이동
      </SharedButton>
    </Wrapper>
  );
};

export default FeedbackDetailPage;

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.space.space24};
`;

const QuestionText = styled.h1`
  padding: ${({ theme }) => theme.space.space40} ${({ theme }) => theme.space.space32};
  font-size: ${({ theme }) => theme.typography.fontSizes.h1};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const CardParagraph = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
  &:not(:last-child) {
    margin-bottom: 1.5em;
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.space20};
  text-align: center;
`;

const CardList = styled.ul`
  list-style-position: outside;
  padding-left: ${({ theme }) => theme.space.space20};
`;

const CardListItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space.space16};
  }
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
