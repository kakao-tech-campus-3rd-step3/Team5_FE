import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
};

export default AuthLayout;

const Wrapper = styled.main`
  height: 100%;
`;
