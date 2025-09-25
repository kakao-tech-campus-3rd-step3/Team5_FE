import axios from 'axios';
import { useEffect, useState } from 'react';

const useQuestion = () => {
  const [question, setQuestion] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://be.dailyq.my/api/questions/random?user_id=1');
        setQuestion(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('유저 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchData();
  }, []);
  return { question };
};

export default useQuestion;
