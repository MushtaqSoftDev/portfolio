// Prevent navigator.gpu getter error
if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
  try {
    delete (navigator as { gpu?: unknown }).gpu;
  } catch (err) {
    console.warn('navigator.gpu deletion skipped:', err);
  }
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
