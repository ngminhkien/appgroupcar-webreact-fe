import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

/**
 * Decode token and check expiration.
 * Returns user payload if valid, null otherwise.
 */
const decodeAndValidate = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // Check expiration (exp is in seconds)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null; // Token expired
    }
    return decoded;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: read token from localStorage and decode
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const decoded = decodeAndValidate(accessToken);

    if (decoded) {
      setUser(decoded);
    } else {
      // Token invalid/expired — clean up
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  /**
   * Called after successful login.
   * Stores tokens and updates user state from JWT payload.
   */
  const login = useCallback((tokens) => {
    const { accessToken, refreshToken } = tokens;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    const decoded = decodeAndValidate(accessToken);
    setUser(decoded);
  }, []);

  /**
   * Logout — clear everything.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access auth state and actions.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
