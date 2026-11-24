import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { AppProviders } from './app/AppProviders';
import { AppErrorBoundary } from './app/AppErrorBoundary';

const root = document.getElementById('root');
if (!root) throw new Error('Missing Spring PetClinic root element.');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <AppProviders>
        <App />
      </AppProviders>
    </AppErrorBoundary>
  </React.StrictMode>
);
