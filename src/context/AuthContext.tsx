import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  subscribeToAuth,
  signInUser,
  signUpUser,
  signOutUser,
  resetUserPassword,
  getReadableAuthError
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      setError(null);
      await signInUser(email, pass);
    } catch (err: any) {
      const msg = getReadableAuthError(err.code || '');
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (email: string, pass: string) => {
    try {
      setError(null);
      await signUpUser(email, pass);
    } catch (err: any) {
      const msg = getReadableAuthError(err.code || '');
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOutUser();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await resetUserPassword(email);
    } catch (err: any) {
      const msg = getReadableAuthError(err.code || '');
      setError(msg);
      throw new Error(msg);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
