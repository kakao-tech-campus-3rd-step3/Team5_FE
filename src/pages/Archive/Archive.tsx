import styled from '@emotion/styled';
import { useRef } from 'react';
import useCanvas from './hooks/useCanvas';

const DUMMY_QUESTIONS = Array.from({ length: 9 }, (_, i) => `질문 ${i + 1}`);

const Archive = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvas({ canvasRef });

  return (
    <Wrapper>
      <h1>아카이브 페이지</h1>
      <Canvas ref={canvasRef} />
    </Wrapper>
  );
};

export default Archive;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  border: 1px solid #000;
  // max-width: vw;
`;
