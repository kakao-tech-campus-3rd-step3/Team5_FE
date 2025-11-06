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
  const { data: question } = useFetch<Question>('/api/questions/random');
  console.log(question);

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
    if (!question || !_user) {
      alert('질문 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const submitData: SubmitAnswerRequest = {
      questionId: question.questionId,
      answerText: text,
      followUp: false, // 기본값: 추가 질문 없음
      ...(audioUrl && { audioUrl }),
    };

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
        <span>DailyQ 모의 면접</span>
        <QuestionCardSection answerState={answerState} question={question} />
        {/* TODO: AnsweredSection 컴포넌트 생성 예정 */}
        <h1>답변 후 메인 페이지</h1>
      </Wrapper>
    );

  return (
    <Wrapper>
      <h1>DailyQ 모의 면접</h1>
      {/* TODO: {user ? `${user.name}님, 오늘의 질문을 확인하세요!` : '오늘의 질문을 확인하세요!'} */}
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
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
