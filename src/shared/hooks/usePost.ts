import { useState } from 'react';

import apiClient from '../../api/apiClient';

import type { AxiosRequestConfig } from 'axios';

interface UsePostOptions<TData = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
}

interface UsePostReturn<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
  execute: (url: string, payload?: unknown, config?: AxiosRequestConfig) => Promise<T>;
  reset: () => void;
}

const usePost = <T = unknown>(options: UsePostOptions<T> = {}): UsePostReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const execute = async (
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const timestamp = new Date().toISOString();
      const callStack = new Error().stack;
      console.log('📤 [usePost] API 요청 시작:', {
        url,
        fullUrl: url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL || ''}${url}`,
        method: 'POST',
        payload,
        config: config || {},
        timestamp,
        callStack: callStack?.split('\n').slice(0, 10).join('\n'), // 상위 10줄만
      });

      const response = await apiClient.post<T>(url, payload, config);
      setData(response.data);

      console.log('✅ [usePost] API 응답 성공:', {
        url,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        timestamp: new Date().toISOString(),
      });

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.error('❌ [usePost] API 요청 실패:', {
        url,
        error: err,
        timestamp: new Date().toISOString(),
      });
      setError(err);

      if (options.onError) {
        options.onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default usePost;
