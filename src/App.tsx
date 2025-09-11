import { ThemeProvider } from '@emotion/react';
import { theme } from './styles/theme';
// import FeedbackPage from './pages/Feedback';
import ArchivePage from './pages/Archive/Archive';
import FeedbackPage from './pages/Feedback/Feedback';
// import SubscribePage from './pages/subscribe';
function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <ArchivePage /> */}
      {/* <SubscribePage /> */}
      <FeedbackPage />
    </ThemeProvider>
  );
}

export default App;
