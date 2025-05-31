import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ZKPassClient } from 'zkpass-sdk';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  verifyRecovery: (recoveryPhrase: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const sdk = new ZKPassClient({
    baseURL: 'http://localhost:3000',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (err) {
      console.error('Navigation failed:', err);
      // Fallback to window.location if navigate fails
      window.location.href = path;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setError(null);
      const response = await sdk.login(username, password);
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      handleNavigation('/encoder');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      setError(null);
      const response = await sdk.register(username, password);
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      handleNavigation('/encoder');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    }
  };

  const verifyRecovery = async (recoveryPhrase: string) => {
    try {
      setError(null);
      const response = await sdk.verifyRecovery(recoveryPhrase);
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      handleNavigation('/encoder');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recovery verification failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    handleNavigation('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        verifyRecovery,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 