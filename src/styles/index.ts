import styled from '@emotion/styled';
import './reset.css';
import './global.css';

export const GlobalStyle = styled.div`
  background: ${({ theme }) => theme.colors.backgroundGradient};
  height: 100%;
`;
