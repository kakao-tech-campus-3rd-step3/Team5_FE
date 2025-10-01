import { useEffect, useState } from 'react';
import apiClient from '../../../api/apiClient';

const useQuestion = () => {
  const [question, setQuestion] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient(`/api/questions/random`, { params: { userId: 1 } });
        setQuestion(response.data);
        // 스트릭 모드 적용 시 랜덤 질문이 두번 불려오는 문제 해결하기
        // console.log(response.data);
      } catch (error) {
        console.error('유저 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchData();
  }, []);
  return { question };
};

export default useQuestion;
