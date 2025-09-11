// Side effect imports (스타일, 글로벌 설정 등)
import './styles';

// Third-party libraries
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Local components
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
