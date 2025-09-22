import { ThemeProvider } from '@emotion/react';
import { theme } from './styles/theme';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { GlobalStyle } from './styles';
import { useState } from 'react';
import PluginInstallPage from './pages/PluginInstall/PluginInstall';
import LoginPage from './pages/Login/Login';

function App() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleInstall = () => {
    setIsInstalled(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle>
        {!isInstalled ? (
          <PluginInstallPage onInstall={handleInstall} />
        ) : !isLoggedIn ? (
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
