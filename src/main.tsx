import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PermanentLinkManager } from './lib/permanentLinks/PermanentLinkManager';

// Initialize permanent links
PermanentLinkManager.initialize().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);