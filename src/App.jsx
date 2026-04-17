import React from 'react';
import { AuthProvider } from './store/AuthContext';
import AppRoutes from './routes';
import Toast from './components/PublicLayout/Toast';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toast />
    </AuthProvider>
  );
}

export default App;
