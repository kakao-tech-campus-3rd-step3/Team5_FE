import { useState } from 'react';

import Lottie from 'lottie-react';
import { Heart } from 'lucide-react';
import apiClient from '../../api/apiClient';
import LoadingAnimation from '../../assets/lottie/loading3.json';
import usePatch from '../../shared/hooks/usePatch';
import SharedButton from '../../shared/ui/SharedButton';
import { theme } from '../../styles/theme';

import Card from './components/Card';
import LevelModal from './components/LevelModal';
import * as S from './styles/Feedback.styles';
import { useAnswers } from './hooks/useAnswers';
import { useStarred } from './hooks/useStarred';
import { useLevel } from './hooks/useLevel';
import { useFeedbackMemo } from './hooks/useFeedbackMemo';

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

export interface AnswerPayload {
  memo?: string;
  starred?: boolean;
  level?: number;
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

interface IFollowUpPayload {
  message: string;
  generatedCount: number;
}
interface IFollowUpResponse {
  nextQuestionId: number;
  questionText: string;
}

const FeedbackPage = () => {
  const { id, data, feedback, question } = useAnswers();

  const { patchData } = usePatch<AnswerPayload, AnswerPayload>(id ? `/api/answers/${id}` : '');

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

  const { isStarred, handleStarredChange } = useStarred({
    starred: data?.starred,
    patchData,
  });

  const {
    questionLevel,
    isLevelModalOpen,
    setIsLevelModalOpen,
    handleModalClick,
    handleLevelSaveAndNavigate,
  } = useLevel({
    level: data?.level,
    patchData,
  });

  const { memoContent, setMemoContent, handleSaveMemo } = useFeedbackMemo({
    memo: data?.memo,
    patchData,
  });

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
          currentLevel={questionLevel}
          onClose={() => setIsLevelModalOpen(false)}
          onSave={handleLevelSaveAndNavigate}
        />
      )}
    </S.Wrapper>
  );
};

export default FeedbackPage;
