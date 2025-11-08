import styled from '@emotion/styled';
import { Heart, Star } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ROUTE_PATH } from '../../routes/routePath';
import SharedButton from '../../shared/ui/SharedButton';
import { theme } from '../../styles/theme';
import Card from '../Feedback/components/Card';
import useAnswers from './hooks/useAnswers';
import useFeedbackMemo from './hooks/useFeedbackMemo';
import usePatch from '../../shared/hooks/usePatch';
import useStarred from './hooks/useStarred';
import useLevel from './hooks/useLevel';

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

export interface AnswerPayload {
  memo?: string;
  starred?: boolean;
  level?: number;
}

const FeedbackDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) return <Navigate to={ROUTE_PATH.ARCHIVE} replace />;

  const { question, feedback, memo, starred = false, level = 0, answerText } = useAnswers(id);
  const { patchData } = usePatch<AnswerPayload, AnswerPayload>(`/api/answers/${id}`);
  const { memoContent, setMemoContent, handleSaveMemo } = useFeedbackMemo({ memo, patchData });
  const { isStarred, handleStarredChange } = useStarred({ starred, patchData });
  const { questionLevel, handleLevelChange } = useLevel({ level, patchData });

  const handleArchiveClick = () => {
    navigate(ROUTE_PATH.ARCHIVE);
  };

  return (
    <Wrapper>
      <SectionContainer>
        <QuestionText>{question?.questionText}</QuestionText>
      </SectionContainer>

      <SectionContainer>
        <InfoWrapper>
          <FilterWrapper>{question?.questionType}</FilterWrapper>
          <FilterWrapper>
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <StyledStar
                key={starIndex}
                onClick={() => handleLevelChange(starIndex)}
                fill={starIndex <= questionLevel ? '#FFD700' : 'none'}
                color="#FFD700"
              />
            ))}
          </FilterWrapper>
          <FilterWrapper onClick={() => handleStarredChange(!isStarred)}>
            <Heart fill={isStarred ? theme.colors.secondary : 'none'} />
          </FilterWrapper>
        </InfoWrapper>
      </SectionContainer>

      <SectionContainer>
        <Title>나의 답변</Title>
        <Card>
          <CardParagraph>{answerText}</CardParagraph>
        </Card>
      </SectionContainer>

      <SectionContainer>
        <Title>AI 분석 레포트</Title>

        <Card>
          <AIFeedbackWrapper>
            <div>
              <CardTitle>좋은 점</CardTitle>
              <CardList>
                {feedback?.content.positivePoints.map((point, index) => (
                  <CardListItem key={index}>{point}</CardListItem>
                ))}
              </CardList>
            </div>
            <div>
              <CardTitle>개선 점</CardTitle>
              <CardList>
                {feedback?.content.pointsForImprovement.map((point, index) => (
                  <CardListItem key={index}>{point}</CardListItem>
                ))}
              </CardList>
            </div>
          </AIFeedbackWrapper>
        </Card>
      </SectionContainer>

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
  //text-align: left;
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

const FilterWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.space8};

  width: auto;
  height: auto;
  padding: ${({ theme }) => theme.space.space8} ${({ theme }) => theme.space.space12};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};

  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: ${({ theme }) => theme.blurs.blur4};
  border-radius: ${({ theme }) => theme.radius.radius24};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
`;

const InfoWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.space16};
  align-items: center;
  justify-content: center;
`;

const StyledStar = styled(Star)`
  cursor: pointer;
  transition: all 0.1s ease-in-out;
`;

const MemoSaveButton = styled(SharedButton)`
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

const AIFeedbackWrapper = styled.div`
  display: flex;
  flex-direction: column; /* ◀ 1. "좋은 점" 그룹과 "개선할 점" 그룹을 세로로 쌓음 */
  width: 100%;
  /* height: 100%; */
  padding: ${({ theme }) => theme.space.space24};
  box-sizing: border-box;

  gap: ${({ theme }) => theme.space.space24};
`;
