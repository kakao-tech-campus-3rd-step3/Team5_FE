import './styles';
import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { logout, isAuthenticated, getAccessToken, getRefreshToken } from './shared/utils/auth';

// 개발 환경에서 콘솔에서 쉽게 사용할 수 있도록 전역 함수 노출
if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).logout = logout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).checkAuth = () => {
    console.log('현재 로그인 상태:', isAuthenticated() ? '로그인됨' : '로그인 안됨');
    console.log(
      'Access Token:',
      getAccessToken() ? getAccessToken()?.substring(0, 20) + '...' : '없음'
    );
    console.log(
      'Refresh Token:',
      getRefreshToken() ? getRefreshToken()?.substring(0, 20) + '...' : '없음'
    );
  };
  console.log('🔧 개발 도구: 콘솔에서 logout() 또는 checkAuth()를 사용할 수 있습니다.');
}

// MSW 클라이언트 초기화
async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    //const { client, mswOptions } = await import('./mock/client');
    // return client.start(mswOptions);
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
