import apiClient from './apiClient';

// 개발용 토큰 응답 타입
export interface DevTokenResponse {
  accessToken?: string;
  refreshToken?: string;
  [key: string]: string | undefined;
}

// 리프레시 토큰 응답 타입
export interface RefreshTokenResponse {
  accessToken?: string;
  refreshToken?: string;
  [key: string]: string | undefined;
}

// 개발용 토큰 획득
export const getDevToken = async (password: string): Promise<DevTokenResponse> => {
  const response = await apiClient.get<DevTokenResponse>('/api/dev/token', {
    params: { password },
  });
  return response.data;
};

// 리프레시 토큰으로 액세스 토큰 갱신
export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>('/api/token/refresh', {
    refresh_token: refreshToken,
  });
  return response.data;
};
