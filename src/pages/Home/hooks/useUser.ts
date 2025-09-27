import { useEffect, useState } from 'react';
import apiClient, { API_BASE_URL } from '../../../api/apiClient';

// TODO: 주석 제거하기
// const UserSchema = z.object({
//   user: z.object({
//     user_id: z.number(),
//     name: z.string(),
//   }),
// });
// type User = z.infer<typeof UserSchema>['user'];

const UseUser = (id?: string) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient(`${API_BASE_URL}/api/user?userId=${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('유저 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchUserData();
  }, []);

  return { user };
};

export default UseUser;
