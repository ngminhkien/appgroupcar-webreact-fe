import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Pre-configured Toaster component for the app.
 * Place this once at the root layout (e.g. App.jsx).
 */
const Toast = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        borderRadius: '0.75rem',
        padding: '12px 16px',
        fontSize: '0.875rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
      },
      success: {
        iconTheme: {
          primary: '#10b981',
          secondary: '#f1f5f9',
        },
      },
      error: {
        iconTheme: {
          primary: '#ef4444',
          secondary: '#f1f5f9',
        },
        duration: 5000,
      },
    }}
  />
);

export default Toast;
