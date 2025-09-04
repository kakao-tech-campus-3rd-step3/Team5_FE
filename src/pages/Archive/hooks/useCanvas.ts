import { useEffect, useState, type RefObject } from 'react';
import { onDown, onMove, onUp } from '../utils/eventHandlers';
import { makePolygon } from '../utils/makePolygon';

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

const useCanvas = ({ canvasRef }: Props) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

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

    const resize = () => {
      const pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx?.scale(pixelRatio, pixelRatio);
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
