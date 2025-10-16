import { ThemeProvider } from '@emotion/react';
import { theme } from './styles/theme';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { GlobalStyle } from './styles';
import { useState } from 'react';
import PluginInstallPage from './pages/PluginInstall/PluginInstall';
import LoginPage from './pages/Login/Login';
import JobSelectionPage from './pages/JobSelection/JobSelection';
import JobDetailSelectionPage from './pages/JobDetailSelection/JobDetailSelection';

function App() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState<string | null>(null);
 //  const isAuthenticated = !!localStorage.getItem('accessToken');
  const isAuthenticated = true;
  const handleInstall = () => {
    setIsInstalled(true);
  };

  const handleJobSelect = (job: string) => {
    setSelectedJob(job);
  };

  const handleJobDetailSelect = (jobDetail: string) => {
    setSelectedJobDetail(jobDetail);
    // TODO: 여기서 메인 앱으로 이동하거나 다음 단계로 진행
    console.log('선택된 직군:', selectedJob, '선택된 세부 직군:', jobDetail);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle>
        {!isInstalled ? (
          <PluginInstallPage onInstall={handleInstall} />
        ) : !isAuthenticated ? (
          <LoginPage />
        ) : !selectedJob ? (
          <JobSelectionPage onNext={handleJobSelect} />
        ) : !selectedJobDetail ? (
          <JobDetailSelectionPage selectedJob={selectedJob} onNext={handleJobDetailSelect} />
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
