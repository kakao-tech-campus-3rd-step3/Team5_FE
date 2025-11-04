import axios, { AxiosError } from 'axios';

import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  getTokenExpiration,
  isTokenExpired,
} from '../shared/utils/auth';

import { refreshAccessToken } from './auth';

import type { InternalAxiosRequestConfig } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
// TODO: .env.local 또는 .env 파일에 VITE_TEMP_AUTH_TOKEN 변수를 설정하세요.
const TEMP_TOKEN = import.meta.env.VITE_TEMP_AUTH_TOKEN;

const apiClient = axios.create({
  baseURL: API_BASE_URL, // 실제 백엔드 서버 URL
  timeout: 30000, // 30초 타임아웃
});

// 리프레시 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.request.use(
  async (config) => {
    // localStorage에서 토큰을 먼저 확인
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    // 임시 토큰이 localStorage에 저장된 경우 자동으로 삭제
    if (token === 'temp-token-for-development') {
      console.warn('⚠️ [API 요청] 임시 토큰이 localStorage에 저장되어 있습니다. 삭제합니다.');
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);

      // 로그인 페이지로 리다이렉트 (현재 경로가 로그인 페이지가 아닐 때만)
      if (!window.location.pathname.includes('/login')) {
        console.warn('⚠️ [API 요청] 로그인 페이지로 이동합니다.');
        window.location.href = '/login';
        return Promise.reject(new Error('임시 토큰 감지 - 로그인 페이지로 이동합니다.'));
      }
    }

    if (token && token !== 'temp-token-for-development') {
      // 토큰이 만료되었거나 곧 만료될 경우 자동으로 갱신
      if (isTokenExpired(token)) {
        const expiration = getTokenExpiration(token);
        const now = Date.now();
        console.log('🔄 [API 요청] 토큰이 만료되었거나 곧 만료됩니다. 자동 갱신 시작...', {
          tokenExpiration: expiration ? new Date(expiration).toISOString() : '알 수 없음',
          currentTime: new Date(now).toISOString(),
          timeUntilExpiration: expiration ? Math.floor((expiration - now) / 1000) : null,
        });
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (refreshToken && !isRefreshing) {
          try {
            isRefreshing = true;
            const response = await refreshAccessToken(refreshToken);
            const { extractTokensFromResponse } = await import('./auth');
            const { accessToken: newAccessToken } = extractTokensFromResponse(response);

            if (newAccessToken) {
              localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
              config.headers['Authorization'] = `Bearer ${newAccessToken}`;
              console.log('✅ [API 요청] 토큰 갱신 완료');
              isRefreshing = false;
              return config;
            } else {
              throw new Error('토큰 갱신 실패: 새로운 액세스 토큰이 없습니다.');
            }
          } catch (refreshError) {
            console.error('❌ [API 요청] 토큰 갱신 실패:', refreshError);
            isRefreshing = false;
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);

            // 로그인 페이지로 리다이렉트
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        } else if (isRefreshing) {
          // 이미 갱신 중이면 잠시 대기
          console.log('⏳ [API 요청] 토큰 갱신 중... 잠시 대기');
        } else {
          console.warn('⚠️ [API 요청] 리프레시 토큰이 없어 자동 갱신 불가');
        }
      }

      // 실제 토큰이 있으면 사용
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (TEMP_TOKEN && !token) {
      // 토큰이 전혀 없을 때만 임시 토큰 사용 (개발용)
      config.headers['Authorization'] = `Bearer ${TEMP_TOKEN}`;
      console.warn('⚠️ [API 요청] 실제 토큰 없음 - 임시 토큰 사용 (개발용)');
    } else if (!token) {
      console.warn('⚠️ [API 요청] 토큰 없음 - 인증되지 않은 요청', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 네트워크 에러 또는 CORS 에러 처리
    if (!error.response && error.code === 'ERR_NETWORK') {
      const errorMessage = error.message || '네트워크 오류가 발생했습니다.';
      const requestUrl = originalRequest.url || '';
      const baseURL = originalRequest.baseURL || '';
      const fullUrl = baseURL + requestUrl;

      console.error('❌ [API 오류] 네트워크 오류:', {
        message: errorMessage,
        code: error.code,
        url: requestUrl,
        baseURL: baseURL,
        fullUrl: fullUrl,
        stack: error.stack,
      });

      // CORS 오류 또는 리다이렉트로 인한 실패인 경우
      // 백엔드가 인증되지 않은 요청을 /login으로 리다이렉트하면 CORS 에러 발생
      const isCorsError =
        errorMessage.includes('CORS') ||
        errorMessage.includes('redirected') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('Network Error') ||
        errorMessage.includes('ERR_FAILED') ||
        (error.stack && (error.stack.includes('CORS') || error.stack.includes('Network Error')));

      // 토큰이 있는 경우, CORS 에러는 토큰 만료 가능성이 높음
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      const hasToken = !!token && token !== 'temp-token-for-development';

      console.log('🔍 [API 오류] 네트워크/CORS 에러 분석:', {
        isCorsError,
        errorMessage,
        hasToken,
        fullUrl,
        urlIncludesLogin: fullUrl.includes('/login'),
        tokenExpired: hasToken ? isTokenExpired(token) : null,
      });

      // CORS 에러이거나 토큰이 있는데 네트워크 에러가 발생한 경우
      if (isCorsError || (hasToken && error.code === 'ERR_NETWORK')) {
        console.warn('⚠️ [API 오류] CORS/네트워크 에러 감지 - 토큰 만료 가능성, 갱신 시도');

        if (!hasToken) {
          console.warn('⚠️ [API 오류] 토큰이 없습니다. 로그인 페이지로 이동합니다.');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(
            new AxiosError(
              '인증이 필요합니다. 로그인 페이지로 이동합니다.',
              'UNAUTHENTICATED',
              originalRequest
            )
          );
        }

        // 토큰이 있으면 만료되었을 가능성이 높으므로 무조건 갱신 시도
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken && !isRefreshing) {
          try {
            isRefreshing = true;
            console.log('🔄 [API 오류] 리프레시 토큰으로 새 액세스 토큰 발급 시도...');
            const response = await refreshAccessToken(refreshToken);
            const { extractTokensFromResponse } = await import('./auth');
            const { accessToken: newAccessToken } = extractTokensFromResponse(response);

            if (newAccessToken) {
              localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
              console.log('✅ [API 오류] 토큰 갱신 완료, 원래 요청 재시도');
              isRefreshing = false;

              // 원래 요청을 새 토큰으로 재시도
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              }
              // _retry 플래그를 설정하여 무한 루프 방지
              originalRequest._retry = true;
              return apiClient(originalRequest);
            } else {
              throw new Error('토큰 갱신 실패: 새로운 액세스 토큰이 없습니다.');
            }
          } catch (refreshError) {
            console.error('❌ [API 오류] 토큰 갱신 실패:', refreshError);
            isRefreshing = false;
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);

            // 로그인 페이지로 리다이렉트
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        } else if (isRefreshing) {
          // 이미 갱신 중이면 대기
          console.log('⏳ [API 오류] 토큰 갱신 중... 대기');
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
              }
              originalRequest._retry = true;
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        } else {
          console.warn('⚠️ [API 오류] 리프레시 토큰이 없어 갱신 불가');
          // 리프레시 토큰이 없으면 로그인 페이지로 리다이렉트
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(
            new AxiosError(
              '인증이 필요합니다. 로그인 페이지로 이동합니다.',
              'UNAUTHENTICATED',
              originalRequest,
              undefined,
              {
                status: 401,
                statusText: 'Unauthorized',
                data: { message: 'Authentication required - redirect to login' },
              } as AxiosError['response']
            )
          );
        }
      }

      return Promise.reject(error);
    }

    // 서버 다운 에러 처리 (521, 502, 503, 504 등)
    if (error.response) {
      const status = error.response.status;

      // Cloudflare 521 에러: Web Server is Down
      if (status === 521 || status === 502 || status === 503 || status === 504) {
        console.error('❌ [API 오류] 서버 연결 실패:', {
          status,
          statusText: error.response.statusText,
          url: originalRequest.url,
          baseURL: originalRequest.baseURL,
          message:
            status === 521
              ? '백엔드 서버가 다운되었거나 연결할 수 없습니다.'
              : '서버에 일시적인 문제가 발생했습니다.',
        });

        const newError = new AxiosError(
          status === 521
            ? '백엔드 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
            : '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          'SERVER_ERROR',
          originalRequest,
          error.response,
          {
            ...error.response,
            data: {
              message:
                status === 521
                  ? '백엔드 서버가 다운되었거나 연결할 수 없습니다.'
                  : '서버에 일시적인 문제가 발생했습니다.',
              status,
              retryable: true,
            },
          }
        );
        return Promise.reject(newError);
      }

      // 응답이 HTML인 경우 (리다이렉트된 경우)
      const contentType = error.response.headers['content-type'] || '';
      if (contentType.includes('text/html')) {
        console.warn('⚠️ [API 오류] HTML 리다이렉트 응답 받음 - 인증이 필요합니다.');
        const newError = new AxiosError(
          '인증이 필요합니다. 로그인 페이지로 이동합니다.',
          'UNAUTHENTICATED',
          originalRequest,
          error.response,
          {
            ...error.response,
            status: 401,
            statusText: 'Unauthorized',
            data: { message: 'Authentication required - redirect to login' },
          }
        );
        return Promise.reject(newError);
      }
    }

    // 401 에러이고, 리프레시 토큰 요청이 아닌 경우에만 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 리프레시 토큰 API 자체는 재시도하지 않음
      if (originalRequest.url?.includes('/api/token/refresh')) {
        // 리프레시 토큰도 만료되었으면 로그인 페이지로 리다이렉트는 AppRouter에서 처리
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 이미 갱신 중이면 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        processQueue(error, null);
        isRefreshing = false;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        return Promise.reject(error);
      }

      try {
        const response = await refreshAccessToken(refreshToken);

        // 응답에서 토큰 추출 (백엔드 응답: { accessToken: "string" }만 반환)
        const { extractTokensFromResponse } = await import('./auth');
        const { accessToken: newAccessToken } = extractTokensFromResponse(response);

        if (newAccessToken) {
          localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
          // 리프레시 토큰은 새로 발급되지 않으므로 기존 것을 유지

          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          isRefreshing = false;

          return apiClient(originalRequest);
        } else {
          throw new Error('토큰 갱신 실패: 새로운 액세스 토큰이 없습니다.');
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);

        // 페이지 리로드하여 AppRouter가 인증 상태를 다시 확인하도록 함
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
