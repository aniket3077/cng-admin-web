import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initAntiInspect } from './utils/antiInspect'

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

initAntiInspect();

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
