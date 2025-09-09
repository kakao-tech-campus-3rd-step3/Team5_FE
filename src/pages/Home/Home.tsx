import styled from '@emotion/styled';
import { useState } from 'react';

const HomePage = () => {
  const [isTextMode, setIsTextMode] = useState(false);

  const handleClick = () => {
    setIsTextMode(!isTextMode);
  };
  return (
    <GlobalWrapper>
      <HomeWrapper>
        <Title>오늘의 질문을 확인하세요!</Title>
        <CardSection>
          <GlassBackground>Click Here!</GlassBackground>
          <button onClick={handleClick}></button>
        </CardSection>
        <TimerSection>
          <Text>제한 시간을 입력하세요!</Text>
        </TimerSection>
      </HomeWrapper>
    </GlobalWrapper>
  );
};

export default HomePage;

const GlobalWrapper = styled.div`
  overflow: hidden;
  height: 100vh;

  background: linear-gradient(
    180deg,
    rgba(247, 151, 30, 0.3) 14.9%,
    rgba(239, 108, 87, 0.4) 52.4%,
    rgba(255, 200, 44, 0.3) 100%
  );
`;

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const CardSection = styled.section`
  position: relative;
`;

const GlassBackground = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  height: 300px;
  width: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TimerSection = styled.section``;

const Text = styled.section``;
