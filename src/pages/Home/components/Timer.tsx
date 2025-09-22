import styled from '@emotion/styled';
import useTimer from '../hooks/useTimer';

interface TimerProps {
  isActive: boolean;
  onAnswerDone: () => void;
}

const userDefinedTime = 10;

const Timer = ({ isActive, onAnswerDone }: TimerProps) => {
  const { min, sec } = useTimer({ userDefinedTime, isActive, onAnswerDone });

  return (
    <Wrapper>
      {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
    </Wrapper>
  );
};

export default Timer;

const Wrapper = styled.div``;
