import { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';

const useFetch = <T>(url: string, options: any = {}) => {
  const [data, setData] = useState<T | null>(null);
  // options 객체를 의존성 배열에 그냥 넣으면 컴포넌트가 리렌더링될 때마다 새로운 객체로 인식되어 무한 루프에 빠질 수 있습니다. 이를 방지하기 위해 객체를 문자열로 변환한 값을 의존성 배열에 추가하는 것이 일반적인 해결책입니다.
  const optionsString = JSON.stringify(options);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient<T>(url, options);
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
