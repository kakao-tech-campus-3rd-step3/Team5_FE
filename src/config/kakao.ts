// 카카오 로그인 설정
export const KAKAO_CONFIG = {
  // TODO: 실제 카카오 앱 키로 교체 필요
  // 카카오 개발자 콘솔에서 발급받은 JavaScript 키를 입력하세요
  JS_KEY: import.meta.env.VITE_KAKAO_JS_KEY || 'YOUR_KAKAO_JS_KEY_HERE',
  REDIRECT_URI: import.meta.env.VITE_KAKAO_REDIRECT_URI || 'http://localhost:5173',
};

// 카카오 SDK 초기화
export const initializeKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao) {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_CONFIG.JS_KEY);
    }
  }
};

// 카카오 로그인
export const loginWithKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao) {
    window.Kakao.Auth.authorize({
      redirectUri: KAKAO_CONFIG.REDIRECT_URI,
    });
  }
};

// 카카오 로그아웃
export const logoutWithKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao) {
    window.Kakao.Auth.logout();
  }
};

// 카카오 사용자 정보 가져오기
export const getKakaoUserInfo = async () => {
  if (typeof window !== 'undefined' && window.Kakao) {
    try {
      const response = await window.Kakao.API.request({
        url: '/v2/user/me',
      });
      return response;
    } catch (error) {
      console.error('카카오 사용자 정보 가져오기 실패:', error);
      throw error;
    }
  }
  return null;
};

// 타입 정의
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}
