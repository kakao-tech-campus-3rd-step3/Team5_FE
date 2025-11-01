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
        const response = await apiClient<T>(url);
        setData(response.data);
      } catch (error) {
        // TODO: 에러 핸들링 로직 추가
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [url, optionsString]);
  return { data };
};

export default useFetch;
