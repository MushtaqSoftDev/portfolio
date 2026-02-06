
// Prevent navigator.gpu getter error
if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
  try {
    delete navigator.gpu
  } catch (err) {
    console.warn('navigator.gpu deletion skipped:', err)
  }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
