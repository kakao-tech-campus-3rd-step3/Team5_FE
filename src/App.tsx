import { ThemeProvider } from '@emotion/react';
import { theme } from './styles/theme';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { GlobalStyle } from './styles';
import { useState } from 'react';
import LoginPage from './pages/Login/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle>
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        )}
      </GlobalStyle>
    </ThemeProvider>
  );
}

export default App;
