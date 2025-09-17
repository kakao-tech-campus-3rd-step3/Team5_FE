import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import AnswerSection from './components/AnswerSection';
import AnswerTypeSelector from './components/AnswerTypeSelector';
import { ROUTE_PATH } from '../../routes/routePath';
import { useNavigate } from 'react-router-dom';

export type AnswerType = 'voice' | 'text' | null;

const HomePage = () => {
  const [answerType, setAnswerType] = useState<AnswerType>(null);
  const [isAnswerStarted, setIsAnswerStarted] = useState(false);
  // const [isAnswered, setIsAnswered] = useState(false);
  const [isAnswered, setIsAnswered] = useState(() => {
    const saved = localStorage.getItem('isAnswered');
    return saved === 'true';
  });
  useEffect(() => {
    localStorage.setItem('isAnswered', String(isAnswered));
  }, [isAnswered]);
  const navigate = useNavigate();

  const handleAnswerType = (type: AnswerType) => {
    setAnswerType(type);
  };

  const handleAnswerDone = () => {
    setIsAnswered(true);
    navigate(ROUTE_PATH.FEEDBACK);
  };

  const handleAnswerState = () => {
    setIsAnswerStarted(true);
  };

  return (
    <Wrapper>
      <span>DailyQ 모의 면접</span>
      <section>
        <QuestionCard isStarted={isAnswerStarted === true}>
          <GlassBackground>
            {isAnswered
              ? 'Cookie와 Local Storage의 차이점이 무엇인가요?'
              : '오늘의 질문을 확인하세요!'}
          </GlassBackground>
        </QuestionCard>
      </section>

      {!isAnswered && (
        <>
          {!isAnswerStarted && (
            <>
              <AnswerTypeSelector type={answerType} onAnswerType={handleAnswerType} />
              <AnswerButton type="button" onClick={handleAnswerState} disabled={!answerType}>
                답변 시작
              </AnswerButton>
            </>
          )}

          {isAnswerStarted && (
            <>
              <AnswerSection
                type={answerType}
                isActive={isAnswerStarted}
                onAnswerDone={handleAnswerDone}
              />
              <AnswerButton type="button" onClick={handleAnswerDone} disabled={!answerType}>
                답변 완료
              </AnswerButton>
            </>
          )}
        </>
      )}

      {isAnswered && (
        <>
          <h1>답변 후 메인 페이지</h1>
        </>
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
