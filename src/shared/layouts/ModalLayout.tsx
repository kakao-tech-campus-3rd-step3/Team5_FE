import styled from '@emotion/styled';
import Navigation from '../components/Navigation/Navigation';
import { Outlet } from 'react-router-dom';

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
  padding-bottom: ${({ theme }) => theme.space.space128};
`;
