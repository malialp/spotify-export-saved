/**
 * Authentication Context
 * Provides auth state and methods throughout the application
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  initiateLogin,
  exchangeCodeForToken,
  parseCallback,
  clearCallbackParams,
} from '../services/spotify';
import { getStoredAccessToken, clearAuthStorage } from '../services/storage';

const AuthContext = createContext(null);

/**
 * Auth states enum
 */
export const AUTH_STATUS = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error',
};

/**
 * AuthProvider component
 * Wraps the app and provides authentication context
 */
export function AuthProvider({ children }) {
  const [status, setStatus] = useState(AUTH_STATUS.LOADING);
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);
  
  // Prevent double execution in React Strict Mode
  const isProcessingCallback = useRef(false);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      // Check for callback parameters first
      const { code, error: callbackError } = parseCallback();

      if (code || callbackError) {
        // Prevent double execution (React Strict Mode)
        if (isProcessingCallback.current) {
          return;
        }
        isProcessingCallback.current = true;

        // Clear URL params immediately to prevent re-processing
        clearCallbackParams();

        if (callbackError) {
          setError(`Authentication failed: ${callbackError}`);
          setStatus(AUTH_STATUS.ERROR);
          isProcessingCallback.current = false;
          return;
        }

        try {
          const tokenData = await exchangeCodeForToken(code);
          setAccessToken(tokenData.access_token);
          setStatus(AUTH_STATUS.AUTHENTICATED);
        } catch (err) {
          setError(err.message);
          setStatus(AUTH_STATUS.ERROR);
        } finally {
          isProcessingCallback.current = false;
        }
        return;
      }

      // Check for stored token
      const storedToken = getStoredAccessToken();

      if (storedToken) {
        setAccessToken(storedToken);
        setStatus(AUTH_STATUS.AUTHENTICATED);
      } else {
        setStatus(AUTH_STATUS.UNAUTHENTICATED);
      }
    };

    initAuth();
  }, []);

  /**
   * Initiates login flow
   */
  const login = useCallback(async () => {
    setError(null);
    try {
      await initiateLogin();
    } catch (err) {
      setError(err.message);
      setStatus(AUTH_STATUS.ERROR);
    }
  }, []);

  /**
   * Logs out the user
   */
  const logout = useCallback(() => {
    setAccessToken(null);
    setStatus(AUTH_STATUS.UNAUTHENTICATED);
    setError(null);
    clearAuthStorage();
  }, []);

  /**
   * Handles token expiration or unauthorized errors
   */
  const handleUnauthorized = useCallback(() => {
    setAccessToken(null);
    setStatus(AUTH_STATUS.UNAUTHENTICATED);
    setError('Session expired. Please log in again.');
    clearAuthStorage();
  }, []);

  const value = useMemo(
    () => ({
      status,
      accessToken,
      error,
      isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
      isLoading: status === AUTH_STATUS.LOADING,
      login,
      logout,
      handleUnauthorized,
    }),
    [status, accessToken, error, login, logout, handleUnauthorized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

