import styled from '@emotion/styled';
import { useEffect, useState, type ChangeEvent } from 'react';
import { ROUTE_PATH } from '../../routes/routePath';
import { useNavigate } from 'react-router-dom';
import QuestionCardSection from './components/sections/QuestionCardSection';
import BeforeAnswerSection from './components/sections/BeforeAnswerSection';
import AnsweringSection from './components/sections/AnsweringSection';
import { z } from 'zod';
import api from '../../api/axiosInstance';

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

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/1');
        const validatedData = UserSchema.parse(response.data);

        setUser(validatedData.user);
      } catch (error) {
        console.error('유저 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleAnswerTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswerType(e.target.value as AnswerType);
  };

  const handleAnswerDone = () => {
    setAnswerState('answered');
    navigate(ROUTE_PATH.FEEDBACK);
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
