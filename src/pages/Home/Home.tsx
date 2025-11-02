import { useState, type ChangeEvent } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

// import { type SubmitAnswerRequest } from '../../api/answers';
//import { ROUTE_PATH } from '../../routes/routePath';
//import useFetch from '../../shared/hooks/useFetch';
//import { getFeedback, postAnswer } from '../../api/feedback';
import { getFeedback, postAnswer } from '../../api/feedback';
import { ROUTE_PATH } from '../../routes/routePath';
import useFetch from '../../shared/hooks/useFetch';

import AnsweringSection from './components/sections/AnsweringSection';
import BeforeAnswerSection from './components/sections/BeforeAnswerSection';
import QuestionCardSection from './components/sections/QuestionCardSection';

export type AnswerType = 'voice' | 'text' | null;
export type AnswerStateType = 'before-answer' | 'answering' | 'answered';

// 사용자 정보 타입
interface User {
  userId: number;
  name: string;
  email: string;
}

// 질문 정보 타입
interface Question {
  questionId: number;
  content: string;
  category?: string;
}

const HomePage = () => {
  const [answerType, setAnswerType] = useState<AnswerType>(null);
  const [answerState, setAnswerState] = useState<AnswerStateType>('before-answer');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 사용자 정보는 현재 미사용이지만 향후 사용 예정
  const { data: _user } = useFetch<User>('/api/user');
  const { data: question } = useFetch<Question>('/api/questions/random');

  // const { execute: submitAnswerPost, loading: isSubmitting } = usePost({
  //   onSuccess: (data) => {
  //     setAnswerState('answered');
  //     navigate(ROUTE_PATH.FEEDBACK, { state: { feedbackId: data.feedbackId } });
  //   },
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   onError: (_error) => {
  //     alert('답변 제출에 실패했습니다. 다시 시도해주세요.');
  //   },
  // });

  const handleAnswerTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswerType(e.target.value as AnswerType);
  };

  const handleAnswerDone = async (answerText: string, audioUrl?: string) => {
    if (!question || !_user) {
      alert('질문 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (answerType === 'text' && answerText.trim() === '') {
      alert('답변을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const postResponse = await postAnswer(
        _user.userId,
        question.questionId,
        answerText,
        audioUrl
      );
      const { feedbackId, answerId } = postResponse;

      const feedbackData = await getFeedback(feedbackId);

      navigate(`${ROUTE_PATH.FEEDBACK}/${feedbackId}`, {
        state: {
          answerId: answerId,
          questionText: question.content,
          userAnswer: answerText,
          feedbackResult: feedbackData,
        },
      });

      setAnswerState('answered');
    } catch (error) {
      console.error('답변 제출 중 오류:', error);
      alert('답변 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswering = () => {
    setAnswerState('answering');
  };

  if (answerState === 'answered')
    return (
      <Wrapper>
        <span>DailyQ 모의 면접</span>
        <QuestionCardSection answerState={answerState} />
        {/* TODO: AnsweredSection 컴포넌트 생성 예정 */}
        <h1>답변 후 메인 페이지</h1>
      </Wrapper>
    );

  return (
    <Wrapper>
      <h1>DailyQ 모의 면접</h1>
      {/* TODO: {user ? `${user.name}님, 오늘의 질문을 확인하세요!` : '오늘의 질문을 확인하세요!'} */}
      <QuestionCardSection answerState={answerState} />

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
