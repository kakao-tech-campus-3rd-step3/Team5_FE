import { radius, zIndex } from './../../styles/tokens';

import '@emotion/react';
import type { theme } from '../styles/theme';

// TODO: 테마 타입 정의 - 디자인 시스템 확정 후 최종 수정
declare module '@emotion/react' {
  export interface Theme {
    colors: typeof theme.colors;
    typography: typeof theme.typography;
    space: typeof theme.space;
    radius: typeof theme.radius;
    zIndex: typeof theme.zIndex;
    blurs: typeof theme.blurs;
  }
}
