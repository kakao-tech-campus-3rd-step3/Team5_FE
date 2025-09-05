import type { State } from '../types';

interface Props {
  e: PointerEvent;
  state: State;
}

export const onDown = ({ e, state }: Props) => {
  state.isDown = true;
  state.moveX = 0;
  state.offsetX = e.offsetX;
};

export const onMove = ({ e, state }: Props) => {
  if (state.isDown) {
    state.moveX = e.offsetX - state.offsetX;
    state.offsetX = e.offsetX;
  }
};

export const onUp = (state: State) => {
  state.isDown = false;
};
