import styled from '@emotion/styled';
import { useRef } from 'react';
import useCanvas from './hooks/useCanvas';

const ArchivePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvas({ canvasRef });

  return (
    <Wrapper>
      <DescriptionWrapper>
        <Title>나의 아카이브</Title>
        <SubTitle>겹겹이 쌓인 당신의 노력을 확인하세요!</SubTitle>
      </DescriptionWrapper>

      <Pinned>
        <SubTitle>Pinned</SubTitle>
      </Pinned>

      <Canvas ref={canvasRef} />
    </Wrapper>
  );
};

export default ArchivePage;

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    rgba(247, 151, 30, 0.3) 14.9%,
    rgba(239, 108, 87, 0.4) 52.4%,
    rgba(255, 200, 44, 0.3) 100%
  );
`;

const DescriptionWrapper = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const SubTitle = styled.h1`
  font-size: 1.1rem;
  font-weight: 700;
`;

const Canvas = styled.canvas`
  background-color: transparent;
`;

const Pinned = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;

  height: 28px;
  padding: 0 22px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 1000px;
`;
