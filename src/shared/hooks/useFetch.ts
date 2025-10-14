import { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';

const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
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
  }, [url]);
  return { data };
};

export default useFetch;
