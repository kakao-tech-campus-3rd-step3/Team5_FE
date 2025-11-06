import styled from '@emotion/styled';

interface GlassBackgroundProps {
  children: React.ReactNode;
}

const GlassBackground = ({ children }: GlassBackgroundProps) => {
  return <Wrapper>{children}</Wrapper>;
};

export default GlassBackground;

const Wrapper = styled.div`
  /* 글래스모피즘 핵심 효과 */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  /* 다층 그림자 효과 */
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(255, 255, 255, 0.2);

  /* 경계선 */
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);

  /* 레이아웃 */
  width: 100%;
  height: 100%;
  color: #f5f5f5;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  /* 타이포그래피 */
  font-size: ${({ theme }) => theme.typography.fontSizes.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textBrown};
  text-align: center;
  line-height: 1.6;

  /* 호버 효과 */
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      inset 0 -1px 0 rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;
