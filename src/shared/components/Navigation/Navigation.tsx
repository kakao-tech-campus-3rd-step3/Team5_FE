import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { ROUTE_PATH } from '../../../routes/routePath';
import { Home, Archive, Star, Users, PlusCircle } from 'lucide-react';

const Navigation = () => {
  return (
    <Wrapper>
      <NavContainer>
        <StyledNavLink to={ROUTE_PATH.HOME}>
          <Home />
        </StyledNavLink>
        <StyledNavLink to={ROUTE_PATH.ARCHIVE}>
          <Archive />
        </StyledNavLink>
        <StyledNavLink to={ROUTE_PATH.FEEDBACK}>
          <PlusCircle />
        </StyledNavLink>
        <StyledNavLink to={ROUTE_PATH.SUBSCRIBE}>
          <Star />
        </StyledNavLink>
        <StyledNavLink to={ROUTE_PATH.RIVAL}>
          <Users />
        </StyledNavLink>
      </NavContainer>
    </Wrapper>
  );
};

export default Navigation;

const Wrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.zIndex300};
`;

const StyledNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.radius16};
  transition: color 0.2s ease-in-out;

  &.active {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 900px;
  height: 65px;
  padding: 0 ${({ theme }) => theme.space.space12};

  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: ${({ theme }) => theme.blurs.blur4};

  border-top-left-radius: ${({ theme }) => theme.radius.radius24};
  border-top-right-radius: ${({ theme }) => theme.radius.radius24};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -3px 20px rgba(0, 0, 0, 0.2);
`;
