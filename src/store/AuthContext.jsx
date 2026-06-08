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
      const userId = decoded.id || decoded.UserId || decoded.userId || decoded.sub || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      if (userId) {
        localStorage.setItem('userId', userId);
      }
      const companyId = decoded.CompanyId || decoded.companyId || decoded.Company || decoded.company;
      if (companyId) {
        localStorage.setItem('companyId', companyId);
      }
    } else {
      // Token invalid/expired — clean up
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('companyId');
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  /**
   * Called after successful login.
   * Stores tokens and updates user state from JWT payload.
   */
  const login = useCallback(async (tokens) => {
    const { accessToken, refreshToken } = tokens;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    const decoded = decodeAndValidate(accessToken);
    if (decoded) {
      const userId = decoded.id || decoded.UserId || decoded.userId || decoded.sub || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      if (userId) {
        localStorage.setItem('userId', userId);
      }
      const companyId = decoded.CompanyId || decoded.companyId || decoded.Company || decoded.company;
      if (companyId) {
        localStorage.setItem('companyId', companyId);
      }
    }

    try {
      const { getUserProfileApi } = await import('../services/userService');
      await getUserProfileApi();
    } catch (error) {
      console.error('Failed to fetch user profile during login:', error);
    }

    setUser(decoded);
  }, []);

  /**
   * Logout — clear everything.
   */
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const { logoutApi } = await import('../services/authService');
        await logoutApi(refreshToken);
      } catch (error) {
        console.error('Logout API failed:', error);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('companyId');
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
