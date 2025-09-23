import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import TempNav from '../components/Navigation/TempNav';
import GNB from '../components/Navigation/Navigation';

const MainLayout = () => {
  return (
    <>
      <TempNav />
      <main>
        <Wrapper>
          <Outlet />
        </Wrapper>
      </main>
      <GNB />
    </>
  );
};

export default MainLayout;

const Wrapper = styled.div`
  height: 100%;
`;
