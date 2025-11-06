import { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

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
    warning: !isValidId
      ? '⚠️ 유효하지 않은 ID입니다. 페이지를 새로고침하거나 올바른 URL로 이동해주세요.'
      : undefined,
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
    fullAnswerUrl: answerUrl
      ? `${import.meta.env.VITE_API_BASE_URL || ''}${answerUrl}`
      : '(호출 안함)',
    fullFeedbackUrl: feedbackUrl
      ? `${import.meta.env.VITE_API_BASE_URL || ''}${feedbackUrl}`
      : '(호출 안함)',
  });

  const { data } = useFetch<FeedbackDetailResponse>(answerUrl);
  const { data: feedback } = useFetch<Feedback>(feedbackUrl);
  const { patchData } = usePatch<AnswerPayload, AnswerPayload>(answerUrl);
  console.log('FeedbackPage API 응답 데이터:', data);

  const question = data?.question;

  const [memoContent, setMemoContent] = useState('');
  useEffect(() => {
    if (data?.memo !== undefined && data.memo !== memoContent) {
      setMemoContent(data.memo || ''); // null이면 빈 문자열로 처리
    }
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

  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  const handleModalClick = () => {
    //navigate(ROUTE_PATH.ARCHIVE);
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
          <CardList>
            <CardParagraph>{data?.answerText}</CardParagraph>
          </CardList>
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

  @media (max-width: 768px) {
    gap: 32px;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.space.space24};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSizes.h3};
    margin-bottom: ${({ theme }) => theme.space.space16};
  }
`;

const QuestionText = styled.h1`
  padding: ${({ theme }) => theme.space.space40} ${({ theme }) => theme.space.space32};
  font-size: ${({ theme }) => theme.typography.fontSizes.h1};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.space.space24} 0;
    font-size: ${({ theme }) => theme.typography.fontSizes.h2};
  }
`;

const CardParagraph = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
  &:not(:last-child) {
    margin-bottom: 1.5em;
  }

  overflow-wrap: break-word;
  word-wrap: break-word;
  //띄어쓰기 기준으로 줄바꿈
  white-space: normal;
  //강제 줄바꿈
  word-break: break-all;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSizes.small};
    line-height: 1.7;
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.space20};
  text-align: center;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSizes.body};
    margin-bottom: ${({ theme }) => theme.space.space12};
  }
`;

const CardList = styled.ul`
  list-style-position: outside;
  padding-left: ${({ theme }) => theme.space.space20};
  text-align: left;

  @media (max-width: 768px) {
    padding-left: ${({ theme }) => theme.space.space16};
  }
`;

const CardListItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space.space16};
  }

  position: relative; /* 1. ::before의 위치 기준점 설정 */

  /* 2. 하이픈이 들어갈 공간(padding-left) 확보 */
  padding-left: ${({ theme }) => theme.space.space16};

  &::before {
    content: '-'; /* 3. 내용으로 하이픈 문자 추가 */
    position: absolute; /* 4. 텍스트 흐름과 관계없이 위치 고정 */
    left: 0; /* 5. padding-left로 만든 공간의 맨 왼쪽에 배치 */
    top: 0; /* 6. 줄의 맨 위에 배치 */
  }

  white-space: normal;
  overflow-wrap: break-word;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSizes.small};
    line-height: 1.7;
    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.space.space12};
    }
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

  @media (max-width: 768px) {
    width: 100%; /* ◀ 카드 안쪽 꽉 채우기 */
    box-sizing: border-box;
    font-size: ${({ theme }) => theme.typography.fontSizes.small};
    min-height: 100px;
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

export default FeedbackPage;
