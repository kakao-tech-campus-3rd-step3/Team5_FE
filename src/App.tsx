import { ThemeProvider } from '@emotion/react';
import { theme } from './styles/theme';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { GlobalStyle } from './styles';

function App() {
  // AppRouter에서 URL 파라미터의 토큰을 처리하므로 여기서는 중복 처리 제거
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </GlobalStyle>
    </ThemeProvider>
  );
}

export default App;
