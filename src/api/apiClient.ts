import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
// TODO: .env.local 또는 .env 파일에 VITE_TEMP_AUTH_TOKEN 변수를 설정하세요.
const TEMP_TOKEN = import.meta.env.VITE_TEMP_AUTH_TOKEN || 'temp-token-for-development';

const apiClient = axios.create({
  baseURL: API_BASE_URL, // 실제 백엔드 서버 URL
  timeout: 30000, // 30초 타임아웃
});

apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰을 먼저 확인
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (TEMP_TOKEN) {
      // 토큰이 없으면 임시 토큰 사용
      config.headers['Authorization'] = `Bearer ${TEMP_TOKEN}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
