import styled from '@emotion/styled';

interface GlassBackgroundProps {
  children: React.ReactNode;
}

const GlassBackground = ({ children }: GlassBackgroundProps) => {
  return <Wrapper>{children}</Wrapper>;
};

export default GlassBackground;

const Wrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: ${({ theme }) => theme.blurs.blur8};
  border-radius: ${({ theme }) => theme.radius.radius24};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;
