import type { RefObject } from 'react';
import type { State } from '../types';

const PI2 = Math.PI * 2;

interface Props {
  state: State;
  pinnedItemRefs: RefObject<HTMLDivElement[] | null>;
  pinnedItemWrapperRef: RefObject<HTMLDivElement | null>;
}

export const makePolygon = ({ state, pinnedItemRefs, pinnedItemWrapperRef }: Props) => {
  const pinnedItems = pinnedItemRefs.current;
  const pinnedItemWrapper = pinnedItemWrapperRef.current;
  if (!pinnedItemWrapper || !pinnedItems) return;

  const width = window.innerWidth;
  const height = window.innerHeight * 0.5;
  const x = width * 0;
  const y = height * 1.4;
  const radius = height * 1;
  const sides = pinnedItems.length;
  const angle = PI2 / sides;
  state.rotate += state.moveX * 0.006;
  state.moveX *= 0.92;

  pinnedItemWrapper.style.transform = `translate(${x}px, ${y}px) rotate(${state.rotate}rad)`;

  pinnedItems.forEach((pinnedItem, i) => {
    const px = radius * Math.cos(angle * i);
    const py = radius * Math.sin(angle * i);
    const itemRotation = angle * i;

    pinnedItem.style.left = `${px}px`;
    pinnedItem.style.top = `${py}px`;
    pinnedItem.style.transform = `translate(-50%, -50%) rotate(${itemRotation}rad)`;
  });
};
