import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

import Navigation from '../components/Navigation/Navigation';

const ModalLayout = () => {
  return (
    <>
      <Wrapper>
        <Outlet />
      </Wrapper>
      <Navigation />
    </>
  );
};

export default ModalLayout;

const Wrapper = styled.main`
  height: auto;
  background: ${({ theme }) => theme.colors.backgroundGradient};
`;
