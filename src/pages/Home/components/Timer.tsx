import styled from '@emotion/styled';
import useTimer from '../hooks/useTimer';

interface TimerProps {
  isActive: boolean;
}

const Timer = ({ isActive }: TimerProps) => {
  const userDefinedTime = 120;
  const { min, sec } = useTimer({ userDefinedTime, isActive });

  return (
    <TimerWrapper>
      {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
    </TimerWrapper>
  );
};

export default Timer;

const TimerWrapper = styled.div``;
