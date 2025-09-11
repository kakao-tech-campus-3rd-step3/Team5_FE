import '@emotion/react';
import type { theme } from '../styles/theme';

// TODO: 예시 입니다. 추후 논의 후 수정하기
declare module '@emotion/react' {
  export interface Theme {
    colors: typeof theme.colors;
    typography: typeof theme.typography;
    spacing: typeof theme.spacing;
  }
}
