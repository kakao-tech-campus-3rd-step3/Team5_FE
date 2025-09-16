import styled from '@emotion/styled';
import useTimer from '../hooks/useTimer';

interface TimerProps {
  isActive: boolean;
}

const Timer = ({ isActive }: TimerProps) => {
  const userDefinedTime = 120;
  const { min, sec } = useTimer({ userDefinedTime, isActive });

  return (
    <Wrapper>
      {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
    </Wrapper>
  );
};

export default Timer;

const Wrapper = styled.div``;
