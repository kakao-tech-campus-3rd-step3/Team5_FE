import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
// TODO: .env.local 또는 .env 파일에 VITE_TEMP_AUTH_TOKEN 변수를 설정하세요.
const TEMP_TOKEN = import.meta.env.VITE_TEMP_AUTH_TOKEN || 'temp-token-for-development';

const apiClient = axios.create({
  baseURL: API_BASE_URL, // 빈 문자열이면 상대 경로로 요청 (프록시 사용)
});

apiClient.interceptors.request.use(
  (config) => {
    if (TEMP_TOKEN) {
      config.headers['Authorization'] = `Bearer ${TEMP_TOKEN}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
