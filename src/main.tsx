import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminProvider } from './context/AdminContext.tsx';
import GlobalErrorBoundary from './components/GlobalErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <AdminProvider>
        <App />
      </AdminProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
);
