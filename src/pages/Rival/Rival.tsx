import styled from '@emotion/styled';
import { css } from '@emotion/react';

const rivalData = {
  nickname: '닉네임',
  intro: '한줄소개',
  dailyQDays: 15,
  answeredQuestions: 28,
};

const RivalPage = () => {
  return (
    <PageContainer>
      <SearchBar placeholder="🔍" />

      <ProfileCard>
        <ProfileIcon>👤</ProfileIcon>
        <ProfileInfo>
          <Nickname>{rivalData.nickname}</Nickname>
          <Intro>{rivalData.intro}</Intro>
        </ProfileInfo>
      </ProfileCard>

      <StatsContainer>
        <StatCard>
          <StatLabel>DailyQ</StatLabel>
          <StatContent>Keep Going!!</StatContent>
          <p style={{ color: '#777' }}>{rivalData.dailyQDays} days +</p>
        </StatCard>
        <StatCard>
          <StatLabel>답변한 질문 개수</StatLabel>
          <StatContent>{rivalData.answeredQuestions}</StatContent>
        </StatCard>
      </StatsContainer>
      
      <StreakCard>
        <p>스트릭</p>
      </StreakCard>

      <CheerButton>응원하기</CheerButton>
    </PageContainer>
  );
};

export default RivalPage;

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const SearchBar = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border-radius: 100px;
  border: 1px solid rgb(117, 117, 117);
  font-size: 1rem;
  
  &::placeholder {
    color: hsl(0, 0%, 0%);
  }
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

const Intro = styled.p`
  font-size: 1rem;
  color: #777;
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
  min-height: 200px;
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
