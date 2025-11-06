import { useEffect, useState } from 'react';

import apiClient from '../../api/apiClient';

import type { AxiosRequestConfig } from 'axios';

const useFetch = <T>(url: string, options?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const optionsString = JSON.stringify(options);

  useEffect(() => {
    // URL이 빈 문자열이면 요청하지 않음
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('📤 [useFetch] API 요청 시작:', {
          url,
          fullUrl: url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL || ''}${url}`,
          method: 'GET',
          options: options || {},
        });

        const response = await apiClient.get<T>(url, options);

        console.log('✅ [useFetch] API 응답 성공:', {
          url,
          status: response.status,
          statusText: response.statusText,
          data: response.data,
        });

        setData(response.data);
      } catch (error: unknown) {
        const err = error as {
          message?: string;
          code?: string;
          response?: { status?: number; statusText?: string; data?: unknown };
          stack?: string;
        };
        console.error('❌ [useFetch] 요청 실패:', {
          url,
          error: error,
          message: err.message,
          code: err.code,
          response: err.response,
          status: err.response?.status,
          statusText: err.response?.statusText,
          responseData: err.response?.data,
          stack: err.stack,
        });
        // TODO: 에러 핸들링 로직 추가
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, optionsString]);
  return { data, loading };
};

export default useFetch;
