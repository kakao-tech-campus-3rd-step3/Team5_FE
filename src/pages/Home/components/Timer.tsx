import styled from '@emotion/styled';
import useTimer from '../hooks/useTimer';
import formatTimeToMMSS from '../utils/formatTimeToMMSS';

interface TimerProps {
  isActive: boolean;
  onAnswerDone: () => void;
}

const userDefinedTime = 100;

const Timer = ({ isActive, onAnswerDone }: TimerProps) => {
  const { remainingSeconds } = useTimer({ userDefinedTime, isActive, onAnswerDone });

  return <Wrapper>{formatTimeToMMSS(remainingSeconds)}</Wrapper>;
};

export default Timer;

const Wrapper = styled.div`
  display: inline-block;
  padding: ${({ theme }) => theme.space.space16};
  background-color: #2c3e50;
  color: #ecf0f1;
  font-size: ${({ theme }) => theme.typography.fontSizes.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  border-radius: ${({ theme }) => theme.radius.radius16};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
`;
