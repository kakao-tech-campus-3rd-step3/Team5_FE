import { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import apiClient from '../../api/apiClient';
import { ROUTE_PATH } from '../../routes/routePath';
import useFetch from '../../shared/hooks/useFetch';
import usePatch from '../../shared/hooks/usePatch';
import SharedButton from '../../shared/ui/SharedButton';
import { theme } from '../../styles/theme';

import Card from './components/Card';
import LevelModal from './components/LevelModal';

export interface Question {
  questionId: number;
  questionType: string;
  questionText: string;
}

export interface FeedbackContent {
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

export interface FeedbackContent {
  positivePoints: string[];
  pointsForImprovement: string[];
}

export interface Feedback {
  status: string; // "PENDING", "COMPLETED" 등
  content: FeedbackContent;
  updatedAt: string;
}

interface IFollowUpPayload {
  message: string;
  generatedCount: number;
}
interface IFollowUpResponse {
  nextQuestionId: number;
  questionText: string;
  // ... 기타 응답 필드
}

const FeedbackPage = () => {
  const navigate = useNavigate();
  //const { feedbackId } = useParams<{ feedbackId: string }>();
  const { id } = useParams();

  const { data } = useFetch<FeedbackDetailResponse>(`/api/answers/${id}`);
  const { data: feedback } = useFetch<Feedback>(`/api/feedback/${id}`);
  const { patchData } = usePatch<AnswerPayload, AnswerPayload>(`/api/answers/${id}`);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  console.log('FeedbackPage API 응답 데이터:', data);

  // 꼬리 질문
  const [followedQ, setFollowedQ] = useState<IFollowUpResponse | null>(null);
  const [followedQLoading, setFollowedQLoading] = useState(false);
  console.log(followedQ);
  console.log(followedQLoading);

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

      setFollowedQ(response.data);
      console.log('요청 성공:', response.data);
      setAnswer('');
    } catch (err) {
      console.error('요청 실패:', err);
    } finally {
      setFollowedQLoading(false);
    }
  };
  // handleRequestFollowUp();

  const question = data?.question;

  const [memoContent, setMemoContent] = useState('');
  useEffect(() => {
    if (data?.memo !== undefined && data.memo !== memoContent) setMemoContent(data?.memo);
  }, [data?.memo, memoContent]);

  const [isStarred, setIsStarred] = useState<boolean | undefined>();
  useEffect(() => {
    setIsStarred(data?.starred);
  }, [data?.starred]);

  const [level, setLevel] = useState<number>(0);
  useEffect(() => {
    if (data?.level !== undefined) {
      setLevel(data?.level);
    }
  }, [data?.level]);

  const handleModalClick = () => {
    setIsLevelModalOpen(true);
  };

  const handleLevelSaveAndNavigate = async (newLevel: number) => {
    const payload: AnswerPayload = { level: newLevel };

    if (newLevel === level) {
      navigate(ROUTE_PATH.ARCHIVE);
      return; // 함수 종료
    }
    //레벨 새로 입력시
    try {
      await patchData(payload);
      setLevel(newLevel);
      navigate(ROUTE_PATH.ARCHIVE); // 저장 성공 시 아카이브로 이동
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      alert('난이도 저장에 실패했습니다.');
      setIsLevelModalOpen(false);
    }
  };

  const handleSaveMemo = async () => {
    const payload: AnswerPayload = { memo: memoContent };
    try {
      await patchData(payload);
      alert('메모가 저장되었습니다.');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      alert('메모 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleStarredChange = async (starred: boolean) => {
    const payload: AnswerPayload = { starred: starred };
    try {
      await patchData(payload);
      setIsStarred(starred);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <Wrapper>
      <SectionContainer>
        {/* TODO: API 응답에 질문 텍스트가 포함되어 있는지 확인 후 연결*/}
        <QuestionText>{question?.questionText}</QuestionText>
      </SectionContainer>

      <SectionContainer>
        <InfoWrapper>
          <FilterWrapper>{question?.questionType}</FilterWrapper>
          <FilterWrapper onClick={() => handleStarredChange(!isStarred)}>
            <Heart fill={isStarred ? theme.colors.secondary : 'none'} />
          </FilterWrapper>
        </InfoWrapper>
      </SectionContainer>

      <SectionContainer>
        <Title>나의 답변</Title>
        <Card>
          <CardParagraph>{data?.answerText}</CardParagraph>
        </Card>
      </SectionContainer>

      <SectionContainer>
        <Title>AI 피드백</Title>

        <Card>
          <CardTitle>좋은 점</CardTitle>
          <CardList>
            {feedback?.content.positivePoints.map((point, index) => (
              <CardListItem key={index}>{point}</CardListItem>
            ))}
          </CardList>
        </Card>

        <Card>
          <CardTitle>개선할 수 있는 점</CardTitle>
          <CardList>
            {feedback?.content.pointsForImprovement.map((point, index) => (
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

      <button onClick={handleRequestFollowUp} disabled={followedQLoading}>
        {followedQ === null ? '꼬리 질문 생성' : '꼬리 질문이 생성 되었습니다'}
      </button>

      <SharedButton type="button" onClick={handleModalClick} disabled={false}>
        아카이브로 이동
      </SharedButton>
      {isLevelModalOpen && (
        <LevelModal
          currentLevel={level}
          onClose={() => setIsLevelModalOpen(false)}
          onSave={handleLevelSaveAndNavigate}
        />
      )}
    </Wrapper>
  );
};

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

export default FeedbackPage;
