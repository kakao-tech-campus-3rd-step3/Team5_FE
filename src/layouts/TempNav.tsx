import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { ROUTE_PATH } from '../routes/routhPath';

// TODO: 임시 네비바입니다. 추후 삭제 예정
const TempNav = () => {
  return (
    <Wrapper>
      <Link to={ROUTE_PATH.HOME}>홈페이지</Link>
      <Link to={ROUTE_PATH.ARCHIVE}>아카이브</Link>
      <Link to={ROUTE_PATH.FEEDBACK}>피드백 페이지</Link>
      <Link to={ROUTE_PATH.SUBSCRIBE}>구독 페이지</Link>
      <Link to={ROUTE_PATH.RIVAL}>라이벌 페이지</Link>
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
