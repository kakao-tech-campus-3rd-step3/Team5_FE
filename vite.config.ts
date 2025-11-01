import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // MSW 활성화 - 질문 API만 목업, 음성 답변은 실제 백엔드
    'import.meta.env.VITE_ENABLE_MSW': '"true"',
    // 실제 백엔드 서버 URL 설정
    'import.meta.env.VITE_API_BASE_URL': '"http://localhost:8080"',
    // 'import.meta.env.VITE_API_BASE_URL': '"https://be.dailyq.my"',
  },
  server: {
    hmr: {
      port: 5174, // HMR 포트를 다르게 설정
    },
    // 네트워크 문제 해결을 위한 설정
    host: true,
    strictPort: false,
    // 음성 답변 API만 실제 백엔드로 프록시
    proxy: {
      '/api/answers': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/api/stt': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/api/sse': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // SSE를 위한 설정
        ws: false, // WebSocket이 아닌 HTTP 스트림
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            // SSE 요청 헤더 설정
            proxyReq.setHeader('Accept', 'text/event-stream');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Connection', 'keep-alive');
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // SSE 응답 헤더 유지
            const contentType = proxyRes.headers['content-type'] || '';
            if (contentType.includes('text/event-stream')) {
              res.setHeader('Content-Type', 'text/event-stream');
              res.setHeader('Cache-Control', 'no-cache');
              res.setHeader('Connection', 'keep-alive');
              res.setHeader('X-Accel-Buffering', 'no');
              // 버퍼링 비활성화
              if (typeof res.flushHeaders === 'function') {
                res.flushHeaders();
              }
            }
          });
          
          proxy.on('error', (err, req, res) => {
            console.error('[SSE 프록시 오류]', err.message);
            if (!res.headersSent) {
              res.statusCode = 502;
              res.end('SSE 프록시 연결 실패');
            }
          });
        },
      },
    }
  },
});
