import { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { Heart, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTE_PATH } from '../../routes/routePath';
import useFetch from '../../shared/hooks/useFetch';
import usePatch from '../../shared/hooks/usePatch';
import SharedButton from '../../shared/ui/SharedButton';

import Card from './components/Card';

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

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // id가 유효한지 엄격하게 확인
  // :id, undefined, 빈 문자열, 숫자가 아닌 문자열 모두 제외
  const isValidId = 
    id && 
    id !== ':id' && 
    id.trim() !== '' && 
    !isNaN(Number(id)) && 
    Number(id) > 0 && 
    Number.isInteger(Number(id));

  const answerId = isValidId ? String(id) : '';
  const feedbackId = isValidId ? String(id) : '';

  console.log('📋 [FeedbackPage] URL 파라미터 확인:', {
    id,
    isValidId,
    answerId,
    feedbackId,
    answerUrl: answerId ? `/api/answers/${answerId}` : '(호출 안함 - 유효하지 않은 ID)',
    feedbackUrl: feedbackId ? `/api/feedback/${feedbackId}` : '(호출 안함 - 유효하지 않은 ID)',
    warning: !isValidId ? '⚠️ 유효하지 않은 ID입니다. 페이지를 새로고침하거나 올바른 URL로 이동해주세요.' : undefined,
  });

  // id가 유효하지 않으면 에러 메시지 표시 후 리다이렉트
  if (!isValidId && id) {
    console.error('❌ [FeedbackPage] 유효하지 않은 ID:', id);
    // 에러 페이지로 리다이렉트하거나 홈으로 이동
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }

  // id가 유효할 때만 API 호출
  const answerUrl = answerId ? `/api/answers/${answerId}` : '';
  const feedbackUrl = feedbackId ? `/api/feedback/${feedbackId}` : '';

  console.log('🚀 [FeedbackPage] API 엔드포인트:', {
    answerUrl: answerUrl || '(호출 안함 - id 없음)',
    feedbackUrl: feedbackUrl || '(호출 안함 - id 없음)',
    baseURL: import.meta.env.VITE_API_BASE_URL || '기본값',
    fullAnswerUrl: answerUrl ? `${import.meta.env.VITE_API_BASE_URL || ''}${answerUrl}` : '(호출 안함)',
    fullFeedbackUrl: feedbackUrl ? `${import.meta.env.VITE_API_BASE_URL || ''}${feedbackUrl}` : '(호출 안함)',
  });

  const { data } = useFetch<FeedbackDetailResponse>(answerUrl);
  const { data: feedback } = useFetch<Feedback>(feedbackUrl);
  const { patchData } = usePatch<AnswerPayload, AnswerPayload>(answerUrl);
  console.log('FeedbackPage API 응답 데이터:', data);

  const question = data?.question;
  // const feedback = data?.feedback;

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

  const handleArchiveClick = () => {
    navigate(ROUTE_PATH.ARCHIVE);
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

  const handleLevelChange = async (level: number) => {
    const payload: AnswerPayload = { level: level };
    try {
      await patchData(payload);
      setLevel(level);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  };

  // if (!data || !question || !feedback) return <div>데이터를 불러오는 중...</div>; // ★ null 대신 로딩 표시

  return (
    <Wrapper>
      <SectionContainer>
        {/* TODO: API 응답에 질문 텍스트가 포함되어 있는지 확인 후 연결*/}
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
                fill={starIndex <= level ? '#FFD700' : 'none'}
                color="#FFD700"
              />
            ))}
          </FilterWrapper>
          <FilterWrapper onClick={() => handleStarredChange(!isStarred)}>
            <Heart />
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
            value={memoContent || ''}
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

const StyledStar = styled(Star)`
  cursor: pointer;
  transition: all 0.1s ease-in-out;
`;

export default FeedbackPage;
