import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // MSW 활성화 (개발 환경에서)
    'import.meta.env.VITE_ENABLE_MSW': '"true"',
  },
  server: {
    hmr: {
      port: 5174, // HMR 포트를 다르게 설정
    },
    // 네트워크 문제 해결을 위한 설정
    host: true,
    strictPort: false,
    // API 프록시 설정 (백엔드 서버가 없을 때 임시 처리)
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 실제 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
        // 백엔드 서버가 없을 때 404 대신 목업 응답 (개발용)
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🚨 백엔드 서버 연결 실패 - 목업 응답 사용');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            
            // URL에 따른 목업 응답
            if (req.url?.includes('/api/answers/upload-url')) {
              res.end(JSON.stringify({
                preSignedUrl: 'https://mock-s3-url.com/upload',
                audioUrl: 'mock-audio-url-123'
              }));
            } else if (req.url?.includes('/api/answers')) {
              res.end(JSON.stringify({
                answerId: 'mock-answer-123',
                status: 'PENDING_STT'
              }));
            } else if (req.url?.includes('/api/sse/connect')) {
              res.writeHead(200, { 'Content-Type': 'text/event-stream' });
              res.end('data: {"type": "connected"}\n\n');
            } else {
              res.end(JSON.stringify({ message: 'Mock API Response' }));
            }
          });
        }
      }
    }
  },
});
