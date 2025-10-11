import { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';

const useFetch = <T>(url: string, options: any = {}) => {
  const [data, setData] = useState<T | null>(null);
  const optionsString = JSON.stringify(options);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<T>(url, options);
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
