import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

import Navigation from '../components/Navigation/Navigation';

const MainLayout = () => {
  return (
    <>
      <Wrapper>
        <Outlet />
      </Wrapper>
      <Navigation />
    </>
  );
};

export default MainLayout;

const Wrapper = styled.main`
  background: ${({ theme }) => theme.colors.backgroundGradient};
  height: 100%;
`;
