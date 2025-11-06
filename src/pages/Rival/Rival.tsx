import { useState, useEffect, useMemo } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { searchRival, getRivalProfile, getFollowingList, getFollowerList } from '../../api/rivals';

import type { RivalProfileResponse, RivalUserItem } from '../../api/rivals';

const RivalPage = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [profile, setProfile] = useState<RivalProfileResponse | null>(null);
  const [myFollowingList, setMyFollowingList] = useState<RivalUserItem[]>([]);
  const [followingList, setFollowingList] = useState<RivalUserItem[]>([]);
  const [followerList, setFollowerList] = useState<RivalUserItem[]>([]);
  const [activeTab, setActiveTab] = useState<'following' | 'follower'>('following');
  const [isLoading, setIsLoading] = useState(false);

  // 기본 목 데이터
  const defaultFriends: RivalUserItem[] = useMemo(
    () => [
      { userId: 1, name: '박준희', email: '김민수@dailyq.com' },
      { userId: 2, name: '김진현', email: '이지영@dailyq.com' },
      { userId: 3, name: '김도현', email: '박준호@dailyq.com' },
      { userId: 4, name: '박소현', email: '최수진@dailyq.com' },
      { userId: 5, name: '이창목', email: '정현우@dailyq.com' },
      { userId: 6, name: '윤자빈', email: '강소영@dailyq.com' },
    ],
    []
  );

  // 페이지 로드 시 내 팔로잉 목록 불러오기
  useEffect(() => {
    const loadMyFollowing = async () => {
      try {
        console.log('🔍 팔로잉 목록 로드 시작...');
        const following = await getFollowingList(undefined, 20);
        console.log('📦 받아온 팔로잉 데이터:', following);
        console.log('📦 following.items:', following.items);

        // API 호출은 성공했지만 데이터가 비어있으면 목 데이터 사용
        if (!following.items || following.items.length === 0) {
          console.log('⚠️ API 응답 데이터가 비어있음 - 목 데이터 사용');
          setMyFollowingList(defaultFriends);
        } else {
          setMyFollowingList(following.items);
          console.log('✅ 팔로잉 목록 상태 업데이트 완료');
        }
      } catch (error) {
        console.error('❌ 팔로잉 목록 로드 실패:', error);
      }
    };
    loadMyFollowing();
  }, [defaultFriends]); // defaultFriends를 의존성 배열에 추가

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchEmail.trim()) {
      setIsLoading(true);
      try {
        const searchResult = await searchRival(searchEmail);
        const profileData = await getRivalProfile(searchResult.userId);
        setProfile(profileData);

        // 검색한 사용자의 팔로잉/팔로워 목록 로드
        const following = await getFollowingList(undefined, 10);
        const follower = await getFollowerList(undefined, 10);
        setFollowingList(following.items);
        setFollowerList(follower.items);
      } catch (error) {
        console.error('검색 실패:', error);
        alert('사용자를 찾을 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Wrapper>
      <SearchBar
        placeholder="🔍 이메일로 검색"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        onKeyDown={handleSearch}
      />

      {/* 내 팔로잉 목록 */}
      <SectionTitle>내 친구 목록 ({myFollowingList?.length || 0}명)</SectionTitle>
      <MyFollowingGrid>
        {myFollowingList && myFollowingList.length > 0 ? (
          myFollowingList.map((user) => (
            <FriendCard key={user.userId}>
              <FriendIcon>👤</FriendIcon>
              <FriendInfo>
                <FriendName>{user.name}</FriendName>
                <FriendEmail>{user.email}</FriendEmail>
              </FriendInfo>
            </FriendCard>
          ))
        ) : (
          <EmptyText>아직 친구가 없습니다. 이메일로 검색해서 친구를 추가해보세요!</EmptyText>
        )}
      </MyFollowingGrid>

      {isLoading && <LoadingText>검색 중...</LoadingText>}

      {profile && (
        <>
          <ProfileCard>
            <ProfileIcon>👤</ProfileIcon>
            <ProfileInfo>
              <Nickname>{profile.name}</Nickname>
              <Email>{profile.email}</Email>
              <Intro>{profile.intro || '한줄소개'}</Intro>
            </ProfileInfo>
          </ProfileCard>

          <StatsContainer>
            <StatCard>
              <StatLabel>DailyQ</StatLabel>
              <StatContent>Keep Going!!</StatContent>
              <p style={{ color: '#777' }}>{profile.dailyQDays || 0} days +</p>
            </StatCard>
            <StatCard>
              <StatLabel>답변한 질문 개수</StatLabel>
              <StatContent>{profile.answeredQuestions || 0}</StatContent>
            </StatCard>
          </StatsContainer>

          <TabContainer>
            <TabButton active={activeTab === 'following'} onClick={() => setActiveTab('following')}>
              팔로잉 ({followingList?.length || 0})
            </TabButton>
            <TabButton active={activeTab === 'follower'} onClick={() => setActiveTab('follower')}>
              팔로워 ({followerList?.length || 0})
            </TabButton>
          </TabContainer>

          <UserListCard>
            {activeTab === 'following' ? (
              followingList && followingList.length > 0 ? (
                followingList.map((user) => (
                  <UserItem key={user.userId}>
                    <UserIcon>👤</UserIcon>
                    <UserInfo>
                      <UserName>{user.name}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                    </UserInfo>
                  </UserItem>
                ))
              ) : (
                <EmptyText>팔로잉한 사용자가 없습니다.</EmptyText>
              )
            ) : followerList && followerList.length > 0 ? (
              followerList.map((user) => (
                <UserItem key={user.userId}>
                  <UserIcon>👤</UserIcon>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserInfo>
                </UserItem>
              ))
            ) : (
              <EmptyText>팔로워가 없습니다.</EmptyText>
            )}
          </UserListCard>

          <CheerButton type="button">응원하기</CheerButton>
        </>
      )}
    </Wrapper>
  );
};

export default RivalPage;

const Wrapper = styled.div`
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

const SectionTitle = styled.h2`
  width: 100%;
  max-width: 400px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin: 8px 0;
  text-align: center;
`;

const MyFollowingGrid = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 auto 24px auto;
`;

const FriendCard = styled.div`
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const FriendIcon = styled.div`
  font-size: 32px;
`;

const FriendInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  flex: 1;
`;

const FriendName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const FriendEmail = styled.p`
  font-size: 0.75rem;
  color: #777;
  word-break: break-all;
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

const Email = styled.p`
  font-size: 0.875rem;
  color: #999;
  margin: 4px 0;
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

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 400px;
`;

interface TabButtonProps {
  active: boolean;
}

const TabButton = styled.button<TabButtonProps>`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ active }) => (active ? '#333' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#ffffff' : '#666')};

  &:hover {
    background-color: ${({ active }) => (active ? '#555' : '#e0e0e0')};
  }
`;

const UserListCard = styled.div`
  ${cardBaseStyles};
  padding: 16px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.5);
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const UserIcon = styled.div`
  font-size: 24px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
`;

const UserEmail = styled.p`
  font-size: 0.75rem;
  color: #777;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #666;
  text-align: center;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: #999;
  text-align: center;
  padding: 24px;
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
