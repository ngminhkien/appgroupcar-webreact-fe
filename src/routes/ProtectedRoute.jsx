import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';

/**
 * ProtectedRoute — Role-based route guard.
 *
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route.
 *   e.g., ['admin', 'system_admin']
 *
 * Behavior:
 * - isLoading → show nothing (prevents flicker)
 * - Not authenticated → redirect to /login
 * - Authenticated but role not in allowedRoles → redirect to /unauthorized
 * - Authorized → render <Outlet />
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  console.log(user)
  // Still initializing auth state — show nothing to prevent flash
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--surface)',
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '3px solid var(--surface-container-highest)',
          borderTopColor: 'var(--primary-container)',
          borderRadius: '50%',
          animation: 'authSpin 0.6s linear infinite',
        }} />
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // Role check (if allowedRoles is specified)
  if (allowedRoles.length > 0) {
    const userRole = user?.Roles || '';
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
