import type { State } from '../types';

const PI2 = Math.PI * 2;

interface Props {
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  state: State;
}

export const makePolygon = ({ ctx, width, height, state }: Props) => {
  if (!ctx) return;
  let x = width / 2;
  let y = height / 0.7;
  let radius = height / 1.1;
  let ratio = 35;
  let sides = 10; // 질문 추가 시 ++

  ctx.save();

  const angle = PI2 / sides;

  ctx.translate(x, y);
  state.rotate += state.moveX * 0.008;
  ctx.rotate(state.rotate);

  for (let i = 0; i < sides; i++) {
    const px = radius * Math.cos(angle * i);
    const py = radius * Math.sin(angle * i);

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle * i);

    ctx.fillStyle = 'coral';
    ctx.beginPath();

    const w = 4 * ratio;
    const h = 5 * ratio;
    ctx.roundRect(-w / 2, -h / 2, w, h, 12);
    ctx.fill();

    ctx.closePath();
    ctx.restore();
  }
  ctx.restore();
};
