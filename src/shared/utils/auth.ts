// 인증 관련 유틸리티 함수

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * 토큰 저장
 */
export const saveTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  console.log('✅ 토큰 저장 완료');
  console.log('🔑 Access Token:', accessToken.substring(0, 20) + '...');
  if (refreshToken) {
    console.log('🔑 Refresh Token:', refreshToken.substring(0, 20) + '...');
  }
};

/**
 * URL 파라미터에서 토큰 파싱 및 저장
 */
export const parseAndSaveTokensFromUrl = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('token') || urlParams.get('accessToken');
  const refreshToken = urlParams.get('refreshToken') || urlParams.get('refresh_token');
  
  if (accessToken) {
    saveTokens(accessToken, refreshToken || undefined);
    
    // URL에서 토큰 파라미터 제거 (보안)
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('token');
    newUrl.searchParams.delete('accessToken');
    newUrl.searchParams.delete('refreshToken');
    newUrl.searchParams.delete('refresh_token');
    window.history.replaceState({}, '', newUrl.toString());
    
    return true;
  }
  
  return false;
};

/**
 * 로그아웃 - 모든 인증 토큰 삭제
 */
export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  console.log('✅ 로그아웃 완료 - 토큰이 삭제되었습니다.');
  
  // 페이지 새로고침하여 인증 상태 업데이트
  window.location.href = '/login';
};

/**
 * 현재 로그인 상태 확인
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * 토큰 가져오기
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

