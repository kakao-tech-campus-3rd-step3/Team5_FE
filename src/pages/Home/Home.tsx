import styled from '@emotion/styled';
import { useEffect, useState, type ChangeEvent } from 'react';
import { ROUTE_PATH } from '../../routes/routePath';
import { useNavigate } from 'react-router-dom';
import QuestionCardSection from './components/sections/QuestionCardSection';
import BeforeAnswerSection from './components/sections/BeforeAnswerSection';
import AnsweringSection from './components/sections/AnsweringSection';
import Logo from '../../shared/ui/Logo';
import useUser from './hooks/useUser';

export type AnswerType = 'voice' | 'text' | null;
export type AnswerStateType = 'before-answer' | 'answering' | 'answered';

const UserSchema = z.object({
  user: z.object({
    user_id: z.number(),
    name: z.string(),
  }),
});

type User = z.infer<typeof UserSchema>['user'];

const HomePage = () => {
  const [answerType, setAnswerType] = useState<AnswerType>(null);
  const [answerState, setAnswerState] = useState<AnswerStateType>('before-answer');
  const navigate = useNavigate();
  // const { id } = useParams();
  const { user } = useUser();
  // TODO: 추후 콘솔 삭제
  console.log(user);

  const handleAnswerTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswerType(e.target.value as AnswerType);
  };

  const handleAnswerDone = async (answerText: string) => {
    if (answerText.trim() === '') {
      alert('답변을 입력해주세요.');
      return;
    }
    
    try {
      // TODO: 로딩 상태 UI 처리 

      const userId = 1; 
      const questionId = 12345; 

      const postResponse = await postAnswer(userId, questionId, answerText);
      const { feedbackId } = postResponse;

      const feedbackData = await getFeedback(feedbackId);

      navigate(ROUTE_PATH.FEEDBACK, { state: { result: feedbackData } });

    } catch (error) {
      console.error('API 처리 실패:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
      // TODO: 로딩 상태 UI 처리 
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
      {/* TOOD: 추후 위치 이동 */}
      {user ? `${user.name}님, 오늘의 질문을 확인하세요!` : '오늘의 질문을 확인하세요!'}
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
