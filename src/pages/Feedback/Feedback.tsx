import { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import Lottie from 'lottie-react';
import { Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import apiClient from '../../api/apiClient';
import LoadingAnimation from '../../assets/lottie/loading3.json';
import { ROUTE_PATH } from '../../routes/routePath';
import useFetch from '../../shared/hooks/useFetch';
import usePatch from '../../shared/hooks/usePatch';
import SharedButton from '../../shared/ui/SharedButton';
import { theme } from '../../styles/theme';

import Card from './components/Card';
import LevelModal from './components/LevelModal';
import * as S from './styles/Feedback.styles';

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
  console.log(question);

  return (
    <S.Wrapper>
      <S.SectionContainer>
        {/* TODO: API 응답에 질문 텍스트가 포함되어 있는지 확인 후 연결*/}
        <S.QuestionText>{question?.questionText}</S.QuestionText>
      </S.SectionContainer>
      <S.SectionContainer>
        <S.InfoWrapper>
          <S.FilterWrapper>{question?.questionType}</S.FilterWrapper>
          <S.FilterWrapper onClick={() => handleStarredChange(!isStarred)}>
            <Heart fill={isStarred ? theme.colors.secondary : 'none'} />
          </S.FilterWrapper>
        </S.InfoWrapper>
      </S.SectionContainer>

      <S.SectionContainer>
        <S.Title>나의 답변</S.Title>
        <Card>
          {!data ? (
            <S.LottieWrapper>
              <Lottie animationData={LoadingAnimation} loop autoplay />
            </S.LottieWrapper>
          ) : (
            <S.CardParagraph>{data.answerText}</S.CardParagraph>
          )}
        </Card>
      </S.SectionContainer>

      <S.SectionContainer>
        <S.Title>AI 분석 레포트</S.Title>
        <Card>
          {!feedback || feedback.status === 'PENDING' ? (
            <S.LottieWrapper>
              <Lottie animationData={LoadingAnimation} loop autoplay />
            </S.LottieWrapper>
          ) : (
            <S.AIFeedbackWrapper>
              {feedback.content.positivePoints.length > 0 && (
                <div>
                  <S.CardTitle>좋은 점</S.CardTitle>
                  <S.CardList>
                    {feedback.content.positivePoints.map((point, index) => (
                      <S.CardListItem key={index}>{point}</S.CardListItem>
                    ))}
                  </S.CardList>
                </div>
              )}
              {feedback.content.pointsForImprovement.length > 0 && (
                <div>
                  <S.CardTitle>개선 점</S.CardTitle>
                  <S.CardList>
                    {feedback.content.pointsForImprovement.map((point, index) => (
                      <S.CardListItem key={index}>{point}</S.CardListItem>
                    ))}
                  </S.CardList>
                </div>
              )}
            </S.AIFeedbackWrapper>
          )}
        </Card>
      </S.SectionContainer>

      <S.SectionContainer>
        <S.Title>메모</S.Title>
        <Card>
          <S.MemoCardContent>
            <S.MemoTextArea
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              placeholder="메모를 작성해주세요."
            />
            <S.MemoSaveButton type="button" onClick={handleSaveMemo} disabled={false}>
              메모 저장
            </S.MemoSaveButton>
          </S.MemoCardContent>
        </Card>
      </S.SectionContainer>

      <S.QButton type="button" onClick={handleRequestFollowUp} disabled={followedQLoading}>
        {followedQ === null ? '꼬리 질문 생성' : '꼬리 질문이 생성 되었습니다'}
      </S.QButton>

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
    </S.Wrapper>
  );
};

export default FeedbackPage;
