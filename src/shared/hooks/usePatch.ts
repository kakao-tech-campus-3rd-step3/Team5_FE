import { useState } from 'react';

import apiClient from '../../api/apiClient';

import type { AxiosRequestConfig } from 'axios';

const usePatch = <T, U>(url: string, options?: AxiosRequestConfig) => {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const patchData = async (payload: U) => {
    setError(null);
    try {
      console.log('📤 [usePatch] API 요청 시작:', {
        url,
        fullUrl: url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL || ''}${url}`,
        method: 'PATCH',
        payload,
        options: options || {},
      });

      const response = await apiClient.patch<T>(url, payload, options);

      console.log('✅ [usePatch] API 응답 성공:', {
        url,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });

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
