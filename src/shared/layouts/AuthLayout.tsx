import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <main>
      <Wrapper>
        <Outlet />
      </Wrapper>
    </main>
  );
};

export default AuthLayout;

const Wrapper = styled.div`
  height: 100%;
`;
