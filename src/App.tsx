import { ThemeProvider } from '@emotion/react';
import { theme } from './styles/theme';
// import FeedbackPage from './pages/Feedback';
import ArchivePage from './pages/Archive/Archive';
import FeedbackPage from './pages/Feedback/Feedback';
import RivalPage from './pages/Rival/Rival';
//import SubscribePage from './pages/Subscribe/Subscribe';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <ArchivePage /> */}
      {/* <SubscribePage /> */}
      {/* <FeedbackPage /> */}
      {/* <RivalPage /> */}
      <RivalPage />
    </ThemeProvider>
  );
}

export default App;
