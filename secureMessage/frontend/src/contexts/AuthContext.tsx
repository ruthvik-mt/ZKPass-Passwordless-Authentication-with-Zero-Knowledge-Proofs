import React, { createContext, useContext, useState, useEffect } from 'react';
import { createZKPassClient, ZKPassClient, ZKPassError } from 'zkpass-sdk';

interface AuthContextType {
  isAuthenticated: boolean;
  uid: string | null;
  login: (uid: string) => Promise<void>;
  register: (uid: string) => Promise<string>;
  verifyRecovery: (recoveryPhrase: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<ZKPassClient | null>(null);

  useEffect(() => {
    // Initialize ZKPass client
    const zkpass = createZKPassClient({
      environment: 'development', // Change to 'production' for production
      apiKey: import.meta.env.VITE_ZKPASS_API_KEY // Add this to your .env file
    });
    setClient(zkpass);

    // Check for stored UID
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUid(storedUid);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (uid: string) => {
    if (!client) throw new Error('Client not initialized');
    try {
      setError(null);
      const response = await client.login(uid);
      setUid(response.uid);
      setIsAuthenticated(true);
      localStorage.setItem('uid', response.uid);
    } catch (err) {
      const error = err as ZKPassError;
      setError(error.message);
      throw error;
    }
  };

  const register = async (uid: string) => {
    if (!client) throw new Error('Client not initialized');
    try {
      setError(null);
      const response = await client.register(uid);
      return response.recoveryPhrase;
    } catch (err) {
      const error = err as ZKPassError;
      setError(error.message);
      throw error;
    }
  };

  const verifyRecovery = async (recoveryPhrase: string) => {
    if (!client) throw new Error('Client not initialized');
    try {
      setError(null);
      const response = await client.verifyRecovery(recoveryPhrase);
      setUid(response.uid);
      setIsAuthenticated(true);
      localStorage.setItem('uid', response.uid);
    } catch (err) {
      const error = err as ZKPassError;
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    setUid(null);
    setIsAuthenticated(false);
    localStorage.removeItem('uid');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        uid,
        login,
        register,
        verifyRecovery,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 