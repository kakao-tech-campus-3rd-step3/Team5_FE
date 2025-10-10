import './styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// MSW 클라이언트 초기화
async function enableMocking() {
  console.log('🔧 MSW 환경 변수:', import.meta.env.VITE_ENABLE_MSW);
  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    console.log('✅ MSW 활성화 중...');
    const { client } = await import('./mock/client');
    const result = await client.start({});
    console.log('✅ MSW 시작 완료:', result);
    return result;
  } else {
    console.log('❌ MSW 비활성화됨');
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
