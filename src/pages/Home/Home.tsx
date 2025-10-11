import styled from '@emotion/styled';
import { useState, type ChangeEvent } from 'react';
import { ROUTE_PATH } from '../../routes/routePath';
import { useNavigate } from 'react-router-dom';
import QuestionCardSection from './components/sections/QuestionCardSection';
import BeforeAnswerSection from './components/sections/BeforeAnswerSection';
import AnsweringSection from './components/sections/AnsweringSection';
import useFetch from '../../shared/hooks/useFetch';
import usePost from '../../shared/hooks/usePost';
import { type SubmitAnswerRequest } from '../../api/answers';

export type AnswerType = 'voice' | 'text' | null;
export type AnswerStateType = 'before-answer' | 'answering' | 'answered';

const HomePage = () => {
  const [answerType, setAnswerType] = useState<AnswerType>(null);
  const [answerState, setAnswerState] = useState<AnswerStateType>('before-answer');
  const navigate = useNavigate();
  const { data: user } = useFetch('/api/user', { params: { userId: 1 } });
  const { data: question } = useFetch('/api/questions/random', { params: { user_id: 1 } });
  
  const { execute: submitAnswerPost, loading: isSubmitting } = usePost({
    onSuccess: (data) => {
      console.log('답변 제출 성공:', data);
      setAnswerState('answered');
      navigate(ROUTE_PATH.FEEDBACK, { state: { feedbackId: data.feedbackId } });
    },
    onError: (error) => {
      console.error('답변 제출 실패:', error);
      alert('답변 제출에 실패했습니다. 다시 시도해주세요.');
    }
  });
  
  // TODO: 추후 콘솔 삭제
  console.log('user:', user);
  console.log('question:', question);
  console.log('question 타입:', typeof question);
  console.log('question이 객체인가?', question && typeof question === 'object');
  console.log('questionId가 있는가?', question && typeof question === 'object' && 'questionId' in question);

  const handleAnswerTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswerType(e.target.value as AnswerType);
  };

  const handleAnswerDone = async (text: string, audioUrl?: string) => {
    console.log('🔍 답변 제출 시도 - question 상태 확인:');
    console.log('  - question:', question);
    console.log('  - question 타입:', typeof question);
    console.log('  - question이 객체인가?', question && typeof question === 'object');
    console.log('  - questionId가 있는가?', question && typeof question === 'object' && 'questionId' in question);
    
    if (!question || typeof question !== 'object' || !('questionId' in question)) {
      console.log('❌ 질문 데이터가 없거나 형식이 잘못됨');
      alert('질문 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const submitData: SubmitAnswerRequest = {
      questionId: (question as any).questionId,
      answerText: text,
      ...(audioUrl && { audioUrl })
    };

    console.log('📤 제출할 데이터:', submitData);

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
