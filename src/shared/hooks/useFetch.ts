import { useEffect, useState } from 'react';

import apiClient from '../../api/apiClient';

import type { AxiosRequestConfig } from 'axios';

const useFetch = <T>(url: string, options?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const optionsString = JSON.stringify(options);

  useEffect(() => {
    // URL이 빈 문자열이면 요청하지 않음
    if (!url) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await apiClient<T>(url, options);
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
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, optionsString]);
  return { data };
};

export default useFetch;
