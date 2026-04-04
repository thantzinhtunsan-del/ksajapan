import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ResetPassword from './components/ResetPassword.tsx';
import './index.css';

const Root = window.location.pathname === '/reset-password' ? ResetPassword : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
