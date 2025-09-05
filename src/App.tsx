import { ThemeProvider } from '@emotion/react';
import { useState } from 'react';
import { theme } from './styles/theme';
import FeedbackPage from './pages/FeedbackPage'; 
function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      {/* <div className="App">
        <h1>DailyQ 프로젝트</h1>
        <p>협업을 위한 깔끔한 시작점입니다.</p>
        <button onClick={() => setCount(count + 1)}>카운트: {count}</button>
      </div> */}
      <FeedbackPage />
    </ThemeProvider>
  );
}

export default App;


