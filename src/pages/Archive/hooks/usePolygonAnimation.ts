import { useEffect, useRef } from 'react';
import { makePolygon } from '../utils/makePolygon';
import { onDown, onMove, onUp } from '../utils/eventHandlers';

const usePolygonAnimation = () => {
  const pinnedItemWrapperRef = useRef<HTMLDivElement>(null);
  const pinnedItemRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const state = {
      isDown: false,
      moveX: 0,
      offsetX: 0,
      rotate: 0,
    };

    const animate = () => {
      makePolygon({ state, pinnedItemRefs, pinnedItemWrapperRef });
      window.requestAnimationFrame(animate);
    };

    document.addEventListener('pointerdown', (e) => onDown({ e, state }));
    document.addEventListener('pointermove', (e) => onMove({ e, state }));
    document.addEventListener('pointerup', () => onUp(state));
    window.requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('pointerdown', (e) => onDown({ e, state }));
      document.removeEventListener('pointermove', (e) => onMove({ e, state }));
      document.removeEventListener('pointerup', () => onUp(state));
    };
  }, []);
  return { pinnedItemWrapperRef, pinnedItemRefs };
};

export default usePolygonAnimation;
