import styled from '@emotion/styled';
import { useState } from 'react';
import AnswerSection from './components/AnswerSection';
import AnswerTypeSelector from './components/AnswerTypeSelector';

export type AnswerType = 'voice' | 'text' | null;

const HomePage = () => {
  const [answerType, setAnswerType] = useState<AnswerType>(null);
  const [isAnswerStarted, setIsAnswerStarted] = useState(false);

  const handleAnswerType = (type: AnswerType) => {
    setAnswerType(type);
  };

  const handleAnswerState = () => {
    setIsAnswerStarted(!isAnswerStarted);
  };

  return (
    <Wrapper>
      <span>DailyQ 모의 면접</span>
      <section>
        <QuestionCard isStarted={isAnswerStarted === true}>
          <GlassBackground>오늘의 질문을 확인하세요!</GlassBackground>
        </QuestionCard>
      </section>

      {!isAnswerStarted && <AnswerTypeSelector type={answerType} onAnswerType={handleAnswerType} />}
      {isAnswerStarted && <AnswerSection type={answerType} isActive={isAnswerStarted} />}

      <AnswerButton type="button" onClick={handleAnswerState} disabled={!answerType}>
        {isAnswerStarted ? '답변 완료' : '답변 시작'}
      </AnswerButton>
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

const QuestionCard = styled.div<{ isStarted: boolean }>`
  width: 300px;
  height: ${(props) => (props.isStarted ? '150px' : '300px')};

  transition: 0.3s ease-in-out;
`;

const GlassBackground = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AnswerButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  background: #333333;
  border-radius: 8px;

  width: 160px;
  height: 40px;

  font-weight: 700;
  font-size: 18px;

  color: #ffffff;
`;
