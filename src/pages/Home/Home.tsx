import styled from '@emotion/styled';

const HomePage = () => {
  return (
    <Wrapper>
      <h1>홈페이지</h1>
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;
`;
