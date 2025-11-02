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
      const response = await apiClient.post<T>(url, payload, config);
      setData(response.data);

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
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
