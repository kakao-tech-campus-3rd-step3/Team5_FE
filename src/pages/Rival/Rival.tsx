import { useState, useEffect, useCallback } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { generatePath, useNavigate } from 'react-router-dom';

import {
  searchRival,
  getRivalProfile,
  getFollowingList,
  getFollowerList,
  addRival,
} from '../../api/rivals';
import { ROUTE_PATH } from '../../routes/routePath';

import type { RivalProfileResponse, RivalSearchResponse, RivalUserItem } from '../../api/rivals';

const RivalPage = () => {
  const navigate = useNavigate();
  const [searchEmail, setSearchEmail] = useState('');
  const [profile, setProfile] = useState<RivalProfileResponse | null>(null);
  const [myFollowingList, setMyFollowingList] = useState<RivalUserItem[]>([]);
  const [followingList, setFollowingList] = useState<RivalUserItem[]>([]);
  const [followerList, setFollowerList] = useState<RivalUserItem[]>([]);
  const [activeTab, setActiveTab] = useState<'following' | 'follower'>('following');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchResult, setModalSearchResult] = useState<RivalSearchResponse | null>(null);
  const [modalProfile, setModalProfile] = useState<RivalProfileResponse | null>(null);
  const [isAddingRival, setIsAddingRival] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const closeModal = () => {
    setIsModalOpen(false);
    setModalError('');
    setModalMessage('');
    setIsAddingRival(false);
  };

  // 페이지 로드 시 내 팔로잉 목록 불러오기
  const loadMyFollowing = useCallback(async () => {
    try {
      console.log('🔍 팔로잉 목록 로드 시작...');
      const following = await getFollowingList(undefined, 20);
      console.log('📦 받아온 팔로잉 데이터:', following);
      console.log('📦 following.items:', following.items);

      const items = following.items ?? [];
      setMyFollowingList(items);
      console.log('✅ 팔로잉 목록 상태 업데이트 완료');
    } catch (error) {
      console.error('❌ 팔로잉 목록 로드 실패:', error);
      setMyFollowingList([]);
    }
  }, []);

  useEffect(() => {
    loadMyFollowing();
  }, [loadMyFollowing]);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchEmail.trim()) {
      setIsLoading(true);
      try {
        const searchResult = await searchRival(searchEmail.trim());
        const profileData = await getRivalProfile(searchResult.userId);
        setProfile(profileData);

        // 검색한 사용자의 팔로잉/팔로워 목록 로드
        const following = await getFollowingList(undefined, 10);
        const follower = await getFollowerList(undefined, 10);
        setFollowingList(following.items);
        setFollowerList(follower.items);

        setModalSearchResult(searchResult);
        setModalProfile(profileData);
        setModalError('');
        setModalMessage('');
        setIsModalOpen(true);
      } catch (error) {
        console.error('검색 실패:', error);
        alert('사용자를 찾을 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddRival = async () => {
    if (!modalSearchResult) return;

    setIsAddingRival(true);
    setModalError('');
    setModalMessage('');
    try {
      await addRival(modalSearchResult.userId);
      await loadMyFollowing();
      setModalMessage('라이벌로 등록되었습니다!');
    } catch (error) {
      console.error('라이벌 추가 실패:', error);
      setModalError('라이벌 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAddingRival(false);
    }
  };

  const handleNavigateToDetail = (userId: number) => {
    closeModal();
    navigate(generatePath(ROUTE_PATH.RIVAL_DETAIL, { userId: userId.toString() }));
  };

  return (
    <>
      {isModalOpen && modalProfile && (
        <ModalOverlay role="dialog" aria-modal="true">
          <ModalCard>
            <CloseButton type="button" aria-label="모달 닫기" onClick={closeModal}>
              ×
            </CloseButton>
            <ModalHeader>
              <ModalAvatar>👤</ModalAvatar>
              <ModalTitle>{modalProfile.name}</ModalTitle>
              <ModalSubtitle>{modalProfile.email}</ModalSubtitle>
            </ModalHeader>
            <ModalBody>
              <ModalInfoRow>
                <InfoLabel>한줄소개</InfoLabel>
                <InfoValue>{modalProfile.intro || '소개가 아직 없어요.'}</InfoValue>
              </ModalInfoRow>
              <ModalInfoRow>
                <InfoLabel>연속 참여</InfoLabel>
                <InfoValue>{modalProfile.dailyQDays || 0}일</InfoValue>
              </ModalInfoRow>
              <ModalInfoRow>
                <InfoLabel>답변 수</InfoLabel>
                <InfoValue>{modalProfile.answeredQuestions || 0}개</InfoValue>
              </ModalInfoRow>
              {modalError && <ModalError>{modalError}</ModalError>}
              {modalMessage && <ModalMessage>{modalMessage}</ModalMessage>}
            </ModalBody>
            <ModalActions>
              <ModalButton type="button" onClick={() => handleNavigateToDetail(modalProfile.userId)}>
                상세 보기
              </ModalButton>
              <PrimaryModalButton
                type="button"
                disabled={isAddingRival}
                onClick={handleAddRival}
              >
                {isAddingRival ? '등록 중...' : '라이벌로 등록'}
              </PrimaryModalButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

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
              <FriendCard
                key={user.userId}
                onClick={() =>
                  navigate(generatePath(ROUTE_PATH.RIVAL_DETAIL, { userId: user.userId.toString() }))
                }
              >
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
                <StatMeta>{profile.dailyQDays || 0} days +</StatMeta>
              </StatCard>
              <StatCard>
                <StatLabel>답변한 질문 개수</StatLabel>
                <StatContent>{profile.answeredQuestions || 0}</StatContent>
              </StatCard>
            </StatsContainer>

            <TabContainer>
              <TabButton
                active={activeTab === 'following'}
                onClick={() => setActiveTab('following')}
              >
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
                    <UserItem
                      key={user.userId}
                      onClick={() => handleNavigateToDetail(user.userId)}
                    >
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
                  <UserItem key={user.userId} onClick={() => handleNavigateToDetail(user.userId)}>
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
    </>
  );
};

export default RivalPage;

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 24px;
  padding-bottom: calc(24px + 65px + 20px); /* 네비게이션 바 높이(65px) + 여유 공간(20px) */
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
  transition: all 0.3s ease;
  width: 100%;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary} 0%,
      ${({ theme }) => theme.colors.secondary} 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: inherit;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
    transition: color 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &::before {
      opacity: 1;
    }

    p {
      color: ${({ theme }) => theme.colors.white};
    }
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

const StatMeta = styled.p`
  font-size: 0.875rem;
  color: #777;
  margin-top: 8px;
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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 24px;
`;

const ModalCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 360px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 32px 28px 24px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #666;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ModalAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f9a8d4, #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
`;

const ModalSubtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #777;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModalInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: #333;
  font-weight: 600;
  text-align: right;
`;

const ModalError = styled.p`
  margin: 8px 0 0;
  font-size: 0.8125rem;
  color: #ef4444;
  text-align: center;
`;

const ModalMessage = styled.p`
  margin: 8px 0 0;
  font-size: 0.8125rem;
  color: #16a34a;
  text-align: center;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
`;

const ModalButton = styled.button`
  flex: 1;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #f9fafb;
    transform: translateY(-1px);
  }
`;

const PrimaryModalButton = styled.button<{ disabled?: boolean }>`
  flex: 1;
  border-radius: 12px;
  border: none;
  background: ${({ disabled }) => (disabled ? '#9ca3af' : '#2563eb')};
  color: white;
  font-weight: 700;
  padding: 12px 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ disabled }) => (disabled ? '#9ca3af' : '#1d4ed8')};
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(-1px)')};
  }
`;
