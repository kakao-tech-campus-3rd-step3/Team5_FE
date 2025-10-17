import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../../routes/routePath';
import apiClient from '../../../api/apiClient';

interface LoginResponse {
  accessToken: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const login = async (provider: 'kakao' | 'google', code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<LoginResponse>(`/auth/${provider}?code=${code}`);
      const { accessToken } = response.data;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        navigate(ROUTE_PATH.HOME, { replace: true });
      } else {
        throw new Error('토큰이 없습니다.');
      }
    } catch (err) {
      setError(err as Error);
      console.error('로그인 처리 실패:', err);
      alert('로그인에 실패했습니다.');
      navigate(ROUTE_PATH.LOGIN, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};