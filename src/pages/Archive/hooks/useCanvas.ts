import { useEffect, type RefObject } from 'react';

import { makePolygon } from '../utils/makePolygon';
import { onDown, onMove, onUp } from '../utils/eventHandlers';

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

const useCanvas = ({ canvasRef }: Props) => {
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const state = {
      isDown: false,
      moveX: 0,
      offsetX: 0,
      rotate: 0,
    };

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      if (!ctx) return;
      const pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
      width = window.innerWidth;
      height = window.innerHeight * 0.5;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(pixelRatio, pixelRatio);
    };

    const animate = () => {
      ctx?.clearRect(0, 0, width, height);
      makePolygon({ ctx, width, height, state });
      window.requestAnimationFrame(animate);

      state.moveX *= 0.92;
    };

    window.addEventListener('resize', resize);
    document.addEventListener('pointerdown', (e) => onDown({ e, state }));
    document.addEventListener('pointermove', (e) => onMove({ e, state }));
    document.addEventListener('pointerup', () => onUp(state));
    window.requestAnimationFrame(animate);

    resize();

    return () => {
      document.removeEventListener('pointerdown', (e) => onDown({ e, state }));
      document.removeEventListener('pointermove', (e) => onMove({ e, state }));
      document.removeEventListener('pointerup', () => onUp(state));
    };
  }, []);
};

export default useCanvas;
