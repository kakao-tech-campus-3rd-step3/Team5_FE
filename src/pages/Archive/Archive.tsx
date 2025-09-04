import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';

const Archive = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const PI2 = Math.PI * 2;
    const state = {
      isDown: false,
      moveX: 0,
      offsetX: 0,
    };

    let pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      window.addEventListener('resize', () => {
        resize();
      });
      document.addEventListener('pointerdown', (e) => {
        onDown(e);
      });
      document.addEventListener('pointermove', (e) => {
        onMove(e);
      });
      document.addEventListener('pointerup', () => {
        onUp();
      });
      window.requestAnimationFrame(() => {
        animate();
      });
      resize();
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx?.scale(pixelRatio, pixelRatio);
    };

    const animate = () => {
      ctx?.clearRect(0, 0, width, height);
      makePolygon();
      window.requestAnimationFrame(() => {
        animate();
      });

      state.moveX *= 0.92;
    };
    let rotate = 0;
    const makePolygon = () => {
      if (!ctx) return;
      let x = width / 2;
      let y = height / 1.5;
      let radius = height / 3.5;
      let ratio = 1.5;
      let sides = 9; // 질문 추가 시 ++

      ctx.save();

      const angle = PI2 / sides;

      ctx.translate(x, y);
      rotate += state.moveX * 0.008;
      ctx.rotate(rotate);

      for (let i = 0; i < sides; i++) {
        const px = radius * Math.cos(angle * i);
        const py = radius * Math.sin(angle * i);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle * i);

        ctx.fillStyle = 'coral';
        ctx.beginPath();

        const w = 50 * ratio;
        const h = 40 * ratio;
        ctx.roundRect(-w / 2, -h / 2, w, h, 12);
        ctx.fill();

        ctx.closePath();
        ctx.restore();
      }
      ctx.restore();
    };

    const onDown = (e: PointerEvent) => {
      state.isDown = true;
      state.moveX = 0;
      state.offsetX = e.offsetX;
    };

    const onMove = (e: PointerEvent) => {
      if (state.isDown) {
        state.moveX = e.offsetX - state.offsetX;
        state.offsetX = e.offsetX;
      }
    };

    const onUp = () => {
      state.isDown = false;
    };

    init();
  }, []);

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
`;
