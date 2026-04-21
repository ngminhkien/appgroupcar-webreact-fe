import React from 'react';
import { AuthProvider } from './store/AuthContext';
import AppRoutes from './routes';
import Toast from './components/PublicLayout/Toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
