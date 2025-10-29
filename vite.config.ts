import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      port: 5174, // HMR 포트를 다르게 설정
    },
    // 네트워크 문제 해결을 위한 설정
    host: true,
    strictPort: false,
  },
});
