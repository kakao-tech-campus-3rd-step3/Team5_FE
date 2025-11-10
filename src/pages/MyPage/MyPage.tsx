import { css } from '@emotion/react';
import styled from '@emotion/styled';

import useFetch from '../../shared/hooks/useFetch';

import StreakSection from './StreakSection';
import FeedbackBoundary from '../../shared/components/Feedback/FeedbackBoundary';

export interface DailySolveCount {
  date: string;
  count: number;
}

export interface UserSummary {
  name: string;
  streak: number;
  totalAnswerCount: number;
  dailySolveCounts: DailySolveCount[];
  isMe: boolean;
}

interface User {
  userId: number;
  name: string;
  email: string;
}

const MyPage = () => {
  const { data: user } = useFetch<User>('/api/user');

  const userId = user?.userId;

  const profileApiUrl = userId ? `/api/rivals/${userId}/profile` : '';

  const { data } = useFetch<UserSummary>(profileApiUrl);

  if (!data) {
    return null;
  }
  return (
    <Wrapper>
      <ProfileCard>
        <ProfileIcon>👤</ProfileIcon>
        <ProfileInfo>
          <Nickname>{data?.name}</Nickname>
        </ProfileInfo>
      </ProfileCard>

      <StatsContainer>
        <StatCard>
          <StatLabel>현재 스트릭</StatLabel>
          <FeedbackBoundary data={data?.streak}>
            <StatContent>{data?.streak} days +</StatContent>
          </FeedbackBoundary>
        </StatCard>
        <StatCard>
          <StatLabel>답변한 질문 개수</StatLabel>
          <FeedbackBoundary data={data?.totalAnswerCount}>
            <StatContent>{data?.totalAnswerCount}</StatContent>
          </FeedbackBoundary>
        </StatCard>
      </StatsContainer>

      <StreakCard>
        <FeedbackBoundary data={data}>
          <StreakSection data={data} />
        </FeedbackBoundary>
      </StreakCard>

      <CheerButton type="button">응원하기</CheerButton>
    </Wrapper>
  );
};

export default MyPage;

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 24px;
  padding-bottom: calc(24px + 65px + 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const cardBaseStyles = css`
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  max-height: 200vh;
  box-sizing: border-box;
`;

const ProfileCard = styled.div`
  ${cardBaseStyles};
  padding: 24px;
  display: flex;
  align-items: center;
  height: 100%;
  gap: 16px;
  min-height: 120px;
`;

const ProfileIcon = styled.div`
  font-size: 32px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nickname = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: #333;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 400px;
`;

const StatCard = styled.div`
  ${cardBaseStyles};
  flex: 1;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 150px;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 8px;
`;

const StatContent = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
`;

const StreakCard = styled.div`
  ${cardBaseStyles};
  padding: 24px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheerButton = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 16px;
  border-radius: 12px;
  background-color: #333;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #555;
  }
`;
