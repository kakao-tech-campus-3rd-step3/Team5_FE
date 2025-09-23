import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation/Navigation';

const MainLayout = () => {
  return (
    <>
      <main>
        <Wrapper>
          <Outlet />
        </Wrapper>
      </main>
      <Navigation />
    </>
  );
};

export default MainLayout;

const Wrapper = styled.div`
  height: 100%;
`;
