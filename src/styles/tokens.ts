// TODO:  secondary, background 색상 미정
export const colors = {
  primary: 'coral',
  secondary: '#F2F0FD',
  white: '#FFFFFF',
  black: '#000000',
  text: '#333333',
  background: '#F8F9FA',
  backgroundGradient: `linear-gradient(
    180deg,
    rgba(247, 151, 30, 0.3) 14.9%,
    rgba(239, 108, 87, 0.4) 52.4%,
    rgba(255, 200, 44, 0.3) 100%
  )`,
};

export const typography = {
  fontSizes: {
    /** 36px */
    h1: '2.25rem',
    /** 24px */
    h2: '1.5rem',
    /** 21px */
    h3: '1.3125rem',
    /** 16px */
    body: '1rem',
  },
  fontWeights: {
    regular: 400,
    bold: 700,
  },
};

export const space = {
  /** 4px */
  xxs: '0.25rem',
  /** 8px */
  xs: '0.5rem',
  /** 12px */
  sm: '0.75rem',
  /** 16px */
  md: '1rem',
  /** 24px */
  lg: '1.5rem',
  /** 32px */
  xl: '2rem',
};

export const radius = {
  /** 4px */
  sm: '0.25rem',
  /** 8px */
  md: '0.5rem',
  /** 16px */
  lg: '1rem',
  /** 원 또는 타원을 만들 때 사용 */
  full: '9999px',
};

export const zIndex = {
  navigation: 100,
  footer: 100,
  modal: 200,
  dropdown: 300,
};
