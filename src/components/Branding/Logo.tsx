import React from 'react';
import styled from '@emotion/styled';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Logo = (props: LogoProps) => {
  const { size = 'medium', color = '#333' } = props;
  return (
    <LogoText $size={size} $color={color}>
      DailyQ
    </LogoText>
  );
};

export default Logo;

const LogoText = styled.h1<{ $size: string; $color: string }>`
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '24px';
      case 'medium':
        return '48px';
      case 'large':
        return '64px';
      default:
        return '48px';
    }
  }};
  font-weight: 700;
  color: ${({ $color }) => $color};
  margin: 0;
  text-align: center;
`;
