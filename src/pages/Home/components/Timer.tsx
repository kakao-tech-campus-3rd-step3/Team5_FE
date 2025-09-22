import styled from '@emotion/styled';
import useTimer from '../hooks/useTimer';
import formatTimeToMMSS from '../utils/formatTimeToMMSS';

interface TimerProps {
  isActive: boolean;
  onAnswerDone: () => void;
}

const userDefinedTime = 10;

const Timer = ({ isActive, onAnswerDone }: TimerProps) => {
  const { remainingSeconds } = useTimer({ userDefinedTime, isActive, onAnswerDone });

  return <Wrapper>{formatTimeToMMSS(remainingSeconds)}</Wrapper>;
};

export default Timer;

const Wrapper = styled.div``;
