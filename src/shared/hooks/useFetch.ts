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
        console.log('📡 [useFetch] 요청 시작:', {
          url,
          options: options,
          fullUrl: url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL || ''}${url}`,
        });
        
        const response = await apiClient<T>(url, options);
        
        console.log('✅ [useFetch] 요청 성공:', {
          url,
          data: response.data,
        });
        
        setData(response.data);
      } catch (error: any) {
        console.error('❌ [useFetch] 요청 실패:', {
          url,
          error: error,
          message: error?.message,
          code: error?.code,
          response: error?.response,
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          responseData: error?.response?.data,
          stack: error?.stack,
        });
        // TODO: 에러 핸들링 로직 추가
      }
    };
    fetchData();
  }, [url, optionsString]);
  return { data };
};

export default useFetch;
