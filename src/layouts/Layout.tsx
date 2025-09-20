import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import GNB from '../components/GNB/GNB';
import TempNav from './TempNav';

const Layout = () => {
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

export default Layout;

const Wrapper = styled.div`
  height: 100vh;
`;
