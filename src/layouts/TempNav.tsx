import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { ROUTE_PATH } from '../routes/routePath';

// TODO: 임시 네비게이션 - 정식 GNB 완성 후 삭제 예정
const TempNav = () => {
  return (
    <Wrapper>
      <StyledNavLink to={ROUTE_PATH.HOME}>홈페이지</StyledNavLink>
      <StyledNavLink to={ROUTE_PATH.ARCHIVE}>아카이브</StyledNavLink>
      <StyledNavLink to={ROUTE_PATH.FEEDBACK}>피드백 페이지</StyledNavLink>
      <StyledNavLink to={ROUTE_PATH.SUBSCRIBE}>구독 페이지</StyledNavLink>
      <StyledNavLink to={ROUTE_PATH.RIVAL}>라이벌 페이지</StyledNavLink>
    </Wrapper>
  );
};

export default TempNav;

const Wrapper = styled.nav`
  display: flex;
  justify-content: center;
  gap: 20px;
  font-weight: 700;

  position: fixed;
  left: 0;
  right: 0;
  z-index: 2000;
`;

const StyledNavLink = styled(NavLink)`
  color: #333;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 10px 15px;
  border-radius: 8px;
  transition: background-color 0.2s ease-in-out;

  &.active {
    color: #fff;
    background-color: coral;
    font-weight: bold;
  }
`;
