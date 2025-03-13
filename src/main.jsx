import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // Ensure this points to the correct file
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>  {/* Wrap your App with AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);
