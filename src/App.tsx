import { ThemeProvider } from '@emotion/react';
import { theme } from './styles/theme';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { GlobalStyle } from './styles';

function App() {
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
