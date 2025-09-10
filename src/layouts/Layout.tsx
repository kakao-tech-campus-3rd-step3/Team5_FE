import { Outlet } from 'react-router-dom';
import GNB from '../components/GNB/GNB';
import TempNav from './TempNav';

const Layout = () => {
  return (
    <>
      <TempNav />
      <main>
        <Outlet />
      </main>
      <GNB />
    </>
  );
};

export default Layout;
