import React from 'react';
import styled from '@emotion/styled';

interface TaglineProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Tagline: React.FC<TaglineProps> = ({ size = 'medium', color = '#666' }) => {
  return (
    <TaglineText $size={size} $color={color}>
      Layer by layer, you become one.
    </TaglineText>
  );
};

export default Tagline;

const TaglineText = styled.p<{ $size: string; $color: string }>`
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '14px';
      case 'medium':
        return '16px';
      case 'large':
        return '18px';
      default:
        return '16px';
    }
  }};
  font-weight: 400;
  color: ${({ $color }) => $color};
  margin: 8px 0 0 0;
  text-align: center;
  line-height: 1.4;
`;
