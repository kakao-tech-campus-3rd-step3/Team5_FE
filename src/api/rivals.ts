import apiClient from './apiClient';

// 검색 응답 타입
export interface RivalSearchResponse {
  userId: number;
  email: string;
  name: string;
}

// 프로필 응답 타입
export interface DailySolveCount {
  date: string;
  count: number;
}

export interface RivalProfileResponse {
  name: string;
  streak: number;
  totalAnswerCount: number;
  dailySolveCounts?: DailySolveCount[];
  isMe: boolean;
}

// 팔로잉/팔로워 목록 아이템
export interface RivalUserItem {
  userId: number;
  name: string;
  email: string;
}

// 팔로잉/팔로워 목록 응답
export interface RivalListResponse {
  items: RivalUserItem[];
  nextCursor: number;
  hasNext: boolean;
}

// 라이벌 검색
export const searchRival = async (email: string): Promise<RivalSearchResponse> => {
  const response = await apiClient.get<RivalSearchResponse>('/api/rivals/search', {
    params: { email },
  });
  return response.data;
};

// 라이벌 프로필 조회
export const getRivalProfile = async (userId: number): Promise<RivalProfileResponse> => {
  const response = await apiClient.get<RivalProfileResponse>(`/api/rivals/${userId}/profile`);
  return response.data;
};

// 팔로잉 목록 조회
export const getFollowingList = async (
  lastId?: number,
  limit: number = 10
): Promise<RivalListResponse> => {
  const response = await apiClient.get<RivalListResponse>('/api/rivals/following', {
    params: { lastId, limit },
  });
  return response.data;
};

// 팔로워 목록 조회
export const getFollowerList = async (
  lastId?: number,
  limit: number = 10
): Promise<RivalListResponse> => {
  const response = await apiClient.get<RivalListResponse>('/api/rivals/followed', {
    params: { lastId, limit },
  });
  return response.data;
};

// 라이벌 추가 응답 타입
export interface AddRivalResponse {
  rivalId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
}

// 라이벌 추가 (팔로우)
export const addRival = async (targetUserId: number): Promise<AddRivalResponse> => {
  const response = await apiClient.post<AddRivalResponse>(`/api/rivals/${targetUserId}`);
  return response.data;
};

// 라이벌 삭제 (언팔로우)
export const deleteRival = async (targetUserId: number): Promise<void> => {
  await apiClient.delete(`/api/rivals/${targetUserId}`);
};
