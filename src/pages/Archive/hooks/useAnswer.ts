import axios from 'axios';
import { useEffect, useState } from 'react';

const useAnswer = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://be.dailyq.my/api/answers?userId=1');

        setData(res.data);
      } catch (error) {
        console.error('유저 데이터를 불러오는 데 실패했습니다:', error);
      }
    };
    fetchData();
  }, []);

  return { data };
};

export default useAnswer;
