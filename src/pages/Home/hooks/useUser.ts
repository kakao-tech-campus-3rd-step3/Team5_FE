// TODO: 유저 데이터 불러오기 훅
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import z from 'zod';

// const UserSchema = z.object({
//   user: z.object({
//     user_id: z.number(),
//     name: z.string(),
//   }),
// });

// type User = z.infer<typeof UserSchema>['user'];
// const UseUser = () => {
//   const [user, setUser] = useState<User | null>(null);
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get('https://be.dailyq.my/api/user?userId=1');
//         const validatedData = UserSchema.parse(response.data);

//         setUser(validatedData.user);
//       } catch (error) {
//         console.error('유저 데이터를 불러오는 데 실패했습니다:', error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return { user };
// };

// export default UseUser;
