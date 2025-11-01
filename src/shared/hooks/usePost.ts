import { useState } from 'react';

import apiClient from '../../api/apiClient';

interface UsePostOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UsePostReturn<T> {
  data: T | null;
  loading: boolean;
  error: any;
  execute: (url: string, payload?: any, config?: any) => Promise<T>;
  reset: () => void;
}

const usePost = <T = any>(options: UsePostOptions = {}): UsePostReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const execute = async (url: string, payload?: any, config?: any): Promise<T> => {
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
