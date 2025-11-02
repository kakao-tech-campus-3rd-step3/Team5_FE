import apiClient from '../../api/apiClient';
import { useState } from 'react';
import type { AxiosRequestConfig } from 'axios';

const usePatch = <T, U>(url: string, options?: AxiosRequestConfig) => {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const patchData = async (payload: U) => {
    setError(null);
    try {
      const response = await apiClient.patch<T>(url, payload, options);

      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { patchData, error, data };
};

export default usePatch;
