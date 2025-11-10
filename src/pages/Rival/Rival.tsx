import { useState, useEffect, useCallback } from 'react';

import styled from '@emotion/styled';
import { generatePath, useNavigate } from 'react-router-dom';

import { searchRival, getRivalProfile, getFollowingList, addRival, deleteRival } from '../../api/rivals';
import { ROUTE_PATH } from '../../routes/routePath';

import type { RivalProfileResponse, RivalSearchResponse, RivalUserItem } from '../../api/rivals';

const RivalPage = () => {
  const navigate = useNavigate();
  const [searchEmail, setSearchEmail] = useState('');
  const [myFollowingList, setMyFollowingList] = useState<RivalUserItem[]>([]);
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

  const handleRemoveRival = async (userId: number) => {
    if (!window.confirm('정말로 이 라이벌을 제거할까요?')) return;
    try {
      await deleteRival(userId);
      await loadMyFollowing();
    } catch (error) {
      console.error('라이벌 제거 실패:', error);
      alert('라이벌 제거에 실패했습니다. 다시 시도해주세요.');
    }
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
              <ModalSubtitle>{modalSearchResult?.email ?? '이메일 정보 없음'}</ModalSubtitle>
            </ModalHeader>
            <ModalBody>
              <ModalInfoRow>
                <InfoLabel>연속 참여</InfoLabel>
                <InfoValue>{modalProfile.streak ?? 0}일</InfoValue>
              </ModalInfoRow>
              <ModalInfoRow>
                <InfoLabel>답변 수</InfoLabel>
                <InfoValue>{modalProfile.totalAnswerCount ?? 0}개</InfoValue>
              </ModalInfoRow>
              {modalProfile.dailySolveCounts && modalProfile.dailySolveCounts.length > 0 && (
                <SolveCountHint>
                  최근 {modalProfile.dailySolveCounts[0]?.date}에{' '}
                  {modalProfile.dailySolveCounts[0]?.count ?? 0}개 해결
                </SolveCountHint>
              )}
              {modalProfile.isMe && (
                <ModalMessage>내 프로필입니다. 라이벌 등록은 비활성화됩니다.</ModalMessage>
              )}
              {modalError && <ModalError>{modalError}</ModalError>}
              {modalMessage && <ModalMessage>{modalMessage}</ModalMessage>}
            </ModalBody>
            <ModalActions>
              <PrimaryModalButton
                type="button"
                disabled={isAddingRival || modalProfile.isMe}
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
              <FriendCard key={user.userId}>
                <FriendContent
                  type="button"
                  onClick={() =>
                    navigate(
                      generatePath(ROUTE_PATH.RIVAL_DETAIL, { userId: user.userId.toString() })
                    )
                  }
                >
                  <FriendIcon>👤</FriendIcon>
                  <FriendInfo>
                    <FriendName>{user.name}</FriendName>
                    <FriendEmail>{user.email}</FriendEmail>
                  </FriendInfo>
                </FriendContent>
                <RemoveButton type="button" onClick={() => handleRemoveRival(user.userId)}>
                  제거
                </RemoveButton>
              </FriendCard>
            ))
          ) : (
            <EmptyText>아직 친구가 없습니다. 이메일로 검색해서 친구를 추가해보세요!</EmptyText>
          )}
        </MyFollowingGrid>

        {isLoading && <LoadingText>검색 중...</LoadingText>}
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
  padding: 12px 12px 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
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

const FriendContent = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  &:focus {
    outline: none;
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

const RemoveButton = styled.button`
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
  }
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

const SolveCountHint = styled.p`
  margin: 12px 0 0;
  font-size: 0.8125rem;
  color: #6b7280;
  text-align: center;
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
  margin-top: 4px;
`;

const PrimaryModalButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  border-radius: 12px;
  border: none;
  background: ${({ disabled }) => (disabled ? '#9ca3af' : '#2563eb')};
  color: white;
  font-weight: 700;
  padding: 12px 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${({ disabled }) => (disabled ? '#9ca3af' : '#1d4ed8')};
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(-1px)')};
  }
`;
