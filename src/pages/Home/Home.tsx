import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { ROUTE_PATH } from '../../routes/routePath';
import { useNavigate } from 'react-router-dom';
import QuestionCardSection from './components/QuestionCardSection';
import BeforeAnswerSection from './components/BeforeAnswerSection';
import AnsweringSection from './components/AnsweringSection';

export type AnswerType = 'voice' | 'text' | null;
export type AnswerStateType = 'before-answer' | 'answering' | 'answered';

interface User {
  user_id: number;
  name: string;
}

const HomePage = () => {
  const [answerType, setAnswerType] = useState<AnswerType>(null);
  // TODO: 삭제 예정
  // const [isAnswerStarted, setIsAnswerStarted] = useState(false);
  // const [isAnswered, setIsAnswered] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerStateType>('before-answer');
  // TODO: 로컬스토리지 활용 코드 (추후 반영 예정)
  // const [isAnswered, setIsAnswered] = useState(() => {
  //   const saved = localStorage.getItem('isAnswered');
  //   return saved === 'true';
  // });
  // useEffect(() => {
  //   localStorage.setItem('isAnswered', String(isAnswered));
  // }, [isAnswered]);
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3001/users/1');
        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error('유저 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleAnswerType = (type: AnswerType) => {
    setAnswerType(type);
  };

  const handleAnswerDone = () => {
    setAnswerState('answered');
    navigate(ROUTE_PATH.FEEDBACK);
  };

  const handleAnswerState = () => {
    setAnswerState('answering');
  };

  if (answerState === 'answered')
    return (
      <Wrapper>
        <span>DailyQ 모의 면접</span>
        <QuestionCardSection isStarted={answerState} />
        <h1>답변 후 메인 페이지</h1>
      </Wrapper>
    );

  return (
    <Wrapper>
      <span>DailyQ 모의 면접</span>
      {/* TOOD: 추후 위치 이동 */}
      {user ? `${user.name}님, 오늘의 질문을 확인하세요!` : '오늘의 질문을 확인하세요!'}
      <QuestionCardSection isStarted={answerState} />

      {answerState === 'before-answer' ? (
        <BeforeAnswerSection
          type={answerType}
          onAnswerType={handleAnswerType}
          onAnswerState={handleAnswerState}
        />
      ) : (
        <AnsweringSection
          type={answerType}
          isStarted={answerState}
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
