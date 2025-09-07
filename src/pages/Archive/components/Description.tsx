import styled from '@emotion/styled';

const Description = () => {
  return (
    <DescriptionWrapper>
      <Title>나의 아카이브</Title>
      <SubTitle>겹겹이 쌓인 당신의 노력을 확인하세요!</SubTitle>
      <Pinned>
        <SubTitle>Pinned</SubTitle>
      </Pinned>
    </DescriptionWrapper>
  );
};

export default Description;

const DescriptionWrapper = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const SubTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
`;

const Pinned = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 28px;
  padding: 0 22px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 1000px;
`;
