import styled from '@emotion/styled';

import GlassBackground from '../../../shared/components/GlassBackground/GlassBackground';

interface CardProps {
  children: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <CardWrapper>
      <GlassBackground>{children}</GlassBackground>
    </CardWrapper>
  );
};

export default Card;

const CardWrapper = styled.div`
  min-width: 700px;
  width: 80%;
  height: 100px;
  min-height: 150px;

  margin-bottom: ${({ theme }) => theme.space.space32};

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
    height: auto;
    min-height: auto;

    margin-bottom: ${({ theme }) => theme.space.space20};
  }
`;
