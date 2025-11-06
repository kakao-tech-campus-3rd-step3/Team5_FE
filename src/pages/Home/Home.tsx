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

interface User {
  userId: number;
  name: string;
  email: string;
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
  const { data: _user } = useFetch<User>('/api/user');
  const { data: question, loading: isLoadingQuestion } = useFetch<Question>('/api/questions/random');
  console.log(question);

  const { execute: submitAnswerPost, loading: isSubmitting } = usePost<SubmitAnswerResponse>({
    onSuccess: (data) => {
      setAnswerState('answered');
      navigate(generatePath(ROUTE_PATH.FEEDBACK, { id: String(data.feedbackId) }));
    },
    onError: (_error: any) => {
      alert('답변 제출에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleAnswerTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswerType(e.target.value as AnswerType);
  };

  const handleAnswerDone = async (text: string, audioUrl?: string) => {
    if (!question || !_user) {
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
        <TitleSpan>DailyQ 모의 면접</TitleSpan>
        <QuestionCardSection answerState={answerState} question={question} isLoading={isLoadingQuestion} />
        {/* TODO: AnsweredSection 컴포넌트 생성 예정 */}
        <h1>답변 후 메인 페이지</h1>
      </Wrapper>
    );

  return (
    <Wrapper>
      <h1>DailyQ 모의 면접</h1>
      {/* TODO: {user ? `${user.name}님, 오늘의 질문을 확인하세요!` : '오늘의 질문을 확인하세요!'} */}
      <QuestionCardSection answerState={answerState} question={question} isLoading={isLoadingQuestion} />

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
          followUp={question?.followUp}
        />
      )}
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  gap: 16px;
  background: ${({ theme }) => theme.colors.backgroundGradient};
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes.h1};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    color: ${({ theme }) => theme.colors.textBrown};
    margin: 0;
    text-align: center;
  }
`;

const TitleSpan = styled.span`
  margin-bottom: 32px;
  font-size: ${({ theme }) => theme.typography.fontSizes.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textBrown};
`;
