import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// TODO: .env.local 또는 .env 파일에 VITE_TEMP_AUTH_TOKEN 변수를 설정하세요.
const TEMP_TOKEN = import.meta.env.VITE_TEMP_AUTH_TOKEN;

const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined, // MSW가 작동하도록 baseURL을 undefined로 설정
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
