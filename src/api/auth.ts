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

// 토큰 추출 유틸 함수 - 여러 가능한 필드명을 시도
export const extractTokensFromResponse = (
  response: RefreshTokenResponse
): { accessToken: string | null; refreshToken: string | null } => {
  // 가능한 액세스 토큰 필드명들 (우선순위 순)
  const accessTokenKeys = [
    'accessToken',
    'access_token',
    'token',
    'authToken',
  ];

  let accessToken: string | null = null;

  // 액세스 토큰 찾기
  for (const key of accessTokenKeys) {
    if (response[key] && typeof response[key] === 'string') {
      accessToken = response[key] as string;
      break;
    }
  }

  // 위 방법으로 찾지 못하면 응답의 모든 키를 로그로 출력 (디버깅용)
  if (!accessToken) {
    console.warn('⚠️ [토큰 추출] 액세스 토큰을 찾을 수 없습니다:', {
      availableKeys: Object.keys(response),
      responseValues: Object.values(response).map((v) =>
        typeof v === 'string' ? v.substring(0, 20) + '...' : v
      ),
    });
    console.warn('⚠️ 백엔드 응답은 { accessToken: "string" } 형태여야 합니다.');
  }

  // 백엔드 응답에는 accessToken만 포함되므로 refreshToken은 null 반환
  // 리프레시 토큰은 새로 발급되지 않고 기존 것을 계속 사용
  return { accessToken, refreshToken: null };
};

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
