import styled from '@emotion/styled';
import { useState, type ChangeEvent } from 'react';
import { ROUTE_PATH } from '../../routes/routePath';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionCardSection from './components/sections/QuestionCardSection';
import BeforeAnswerSection from './components/sections/BeforeAnswerSection';
import AnsweringSection from './components/sections/AnsweringSection';
import Logo from '../../shared/ui/Logo';
import useUser from './hooks/useUser';

export type AnswerType = 'voice' | 'text' | null;
export type AnswerStateType = 'before-answer' | 'answering' | 'answered';

const HomePage = () => {
  const [answerType, setAnswerType] = useState<AnswerType>(null);
  const [answerState, setAnswerState] = useState<AnswerStateType>('before-answer');
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser(id);
  // TODO: 추후 콘솔 삭제
  console.log(user);

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
        <LogoWrapper>
          <Logo size="medium" color="#333" />
        </LogoWrapper>
        <QuestionCardSection answerState={answerState} />
        {/* TODO: AnsweredSection 컴포넌트 생성 예정 */}
        <h1>답변 후 메인 페이지</h1>
      </Wrapper>
    );

  return (
    <Wrapper>
      <LogoWrapper>
        <Logo size="medium" color="#333" />
      </LogoWrapper>

      {/* TODO: {user ? <Text>안녕하세요, {user.name}!</Text> : <Text>오늘의 질문을 확인하세요!</Text>} */}

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
  overflow: auto;
  margin-bottom: ${({ theme }) => theme.space.space64};
`;

const LogoWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.space.space16};
`;
