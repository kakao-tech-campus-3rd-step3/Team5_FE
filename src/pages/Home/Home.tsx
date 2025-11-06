import { useState, type ChangeEvent } from 'react';

import styled from '@emotion/styled';
import { generatePath, useNavigate } from 'react-router-dom';

import { type SubmitAnswerRequest, type SubmitAnswerResponse } from '../../api/answers';
import { ROUTE_PATH } from '../../routes/routePath';
import useFetch from '../../shared/hooks/useFetch';
import usePost from '../../shared/hooks/usePost';

import AnsweringSection from './components/sections/AnsweringSection';
import BeforeAnswerSection from './components/sections/BeforeAnswerSection';
import QuestionCardSection from './components/sections/QuestionCardSection';

export type AnswerType = 'voice' | 'text' | null;
export type AnswerStateType = 'before-answer' | 'answering' | 'answered';

export interface Job {
  jobId: number;
  jobName: string;
}

export interface Preferences {
  dailyQuestionLimit: number;
  questionMode: 'TECH' | 'FLOW' | 'BEHAVIOR' | string;
  timeLimitSeconds: number;
  allowPush: boolean;
}

export interface User {
  userId: number;
  email: string;
  name: string;
  streak: number;
  solvedToday: boolean;
  preferences: Preferences;
  jobs: Job[];
}

// 질문 정보 타입
export interface Question {
  questionId: number;
  questionType: string;
  flowPhase: string;
  questionText: string;
  jobId: number;
  timeLimitSeconds: number;
  followUp: boolean;
  flowPhaseConsistent: boolean;
}

const HomePage = () => {
  const [answerType, setAnswerType] = useState<AnswerType>(null);
  const [answerState, setAnswerState] = useState<AnswerStateType>('before-answer');
  const navigate = useNavigate();

  // 사용자 정보는 현재 미사용이지만 향후 사용 예정
  const { data: user } = useFetch<User>('/api/user');
  const { data: question } = useFetch<Question>('/api/questions/random');
  console.log(user);

  console.log(question?.followUp);

  const { execute: submitAnswerPost, loading: isSubmitting } = usePost<SubmitAnswerResponse>({
    onSuccess: (data) => {
      setAnswerState('answered');
      navigate(generatePath(ROUTE_PATH.FEEDBACK, { id: String(data.feedbackId) }));
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (_error: unknown) => {
      alert('답변 제출에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleAnswerTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswerType(e.target.value as AnswerType);
  };

  const handleAnswerDone = async (text: string, audioUrl?: string) => {
    if (!question || !user) {
      alert('질문 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // audioUrl이 없거나 빈 문자열인 경우 (텍스트 답변)
    // answerText가 비어있으면 안 됨
    const hasAudioUrl = audioUrl && audioUrl.trim() !== '';
    if (!hasAudioUrl && (!text || text.trim() === '')) {
      alert('답변을 입력해주세요.');
      console.error('❌ [답변 제출 실패] 텍스트 답변인데 answerText가 비어있습니다:', {
        text,
        audioUrl,
        questionId: question.questionId,
      });
      return;
    }

    const submitData: SubmitAnswerRequest = {
      questionId: question.questionId,
      answerText: text || '', // 빈 문자열이어도 전송 (음성 답변의 경우)
      followUp: question.followUp, // 질문 응답의 followUp 값 사용
    };

    // audioUrl이 있으면 반드시 포함
    if (audioUrl) {
      submitData.audioUrl = audioUrl;
    }

    console.log('📤 [Home] 답변 제출 요청:', {
      questionId: submitData.questionId,
      answerText: submitData.answerText,
      audioUrl: submitData.audioUrl,
      followUp: submitData.followUp,
      note: audioUrl ? '음성 답변' : '텍스트 답변',
    });

    try {
      await submitAnswerPost('/api/answers', submitData);
    } catch (error) {
      console.error('답변 제출 중 오류:', error);
    }
  };

  const handleAnswering = () => {
    setAnswerState('answering');
  };

  if (answerState === 'answered')
    return (
      <Wrapper>
        <ContentCard>
          <span>DailyQ 모의 면접</span>
          <QuestionCardSection answerState={answerState} question={question} />
          {/* TODO: AnsweredSection 컴포넌트 생성 예정 */}
          <h1>답변 후 메인 페이지</h1>
        </ContentCard>
      </Wrapper>
    );

  return (
    <Wrapper>
      <GridWrapper>
        {/* {user ? `${user.name}님, 안녕하세요!` : '안녕하세요!'} */}
        <GlassBackground>남은 질문: {user?.preferences?.dailyQuestionLimit} 개</GlassBackground>
      </GridWrapper>

      <ContentCard>
        <QuestionCardSection answerState={answerState} question={question} />
        {answerState === 'before-answer' ? (
          <BeforeAnswerSection
            type={answerType}
            onAnswerTypeChange={handleAnswerTypeChange}
            onAnswering={handleAnswering}
          />
        ) : (
          <AnsweringSection
            type={answerType}
            answerState={answerState}
            onAnswerDone={handleAnswerDone}
            isSubmitting={isSubmitting}
            questionId={question?.questionId}
            userDefinedTime={question?.timeLimitSeconds}
          />
        )}
      </ContentCard>
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.space.space24};
  gap: ${({ theme }) => theme.space.space24};

  background-color: #333333;
  color: #f5f5f5;

  position: relative;
  overflow: hidden;

  /* 👈 Apple-Style: 시스템 폰트 스택 적용 */
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
`;

const GridWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 650px;
  position: relative;
  z-index: 1;
`;

const GlassBackground = styled.div`
  /* 👈 Apple-Style: 상단 위젯은 10% 투명도 유지 */
  background-color: hsla(0, 0%, 100%, 0.1);
  backdrop-filter: ${({ theme }) => theme.blurs.blur8};

  /* 👈 Apple-Style: 24px -> 20px로 변경 */
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  /* 👈 Apple-Style: 더 부드러운 그림자 */
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);

  color: #f5f5f5;
  height: auto;
  padding: ${({ theme }) => theme.space.space16};

  flex: 1;
  min-width: 200px;
  max-width: 320px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-size: ${({ theme }) => theme.typography.fontSizes.body};

  /* 👈 Apple-Style: bold(700) -> 600 (semibold)로 변경 */
  font-weight: 600;

  transition: all 0.3s ease;
  &:hover {
    background-color: hsla(0, 0%, 100%, 0.15);
    transform: translateY(-5px);
  }
`;

const ContentCard = styled.div`
  // width: 100%;
  // max-width: 650px;

  // /* 👈 Apple-Style: 메인 카드는 15% 투명도로 계층 구분 */
  // background-color: hsla(0, 0%, 100%, 0.15);
  // backdrop-filter: ${({ theme }) => theme.blurs.blur8};

  // /* 👈 Apple-Style: 24px -> 20px로 변경 */
  // border-radius: 20px;
  // border: 1px solid rgba(255, 255, 255, 0.2);

  // /* 👈 Apple-Style: 더 부드러운 그림자 */
  // box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);

  // /* 👈 Apple-Style: 넉넉한 내부 여백 (space24 -> space32 가정) */
  // padding: ${({ theme }) => theme.space.space32 || '2rem'};

  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // gap: ${({ theme }) => theme.space.space24};

  // position: relative;
  // z-index: 1;
`;
