import styled from '@emotion/styled';

const Description = () => {
  return (
    <DescriptionWrapper>
      <Title>나의 아카이브</Title>
      <SubTitle>겹겹이 쌓인 당신의 노력을 확인하세요!</SubTitle>
    </DescriptionWrapper>
  );
};

export default Description;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.h1};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.space8};
`;

const SubTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.space64};
`;
