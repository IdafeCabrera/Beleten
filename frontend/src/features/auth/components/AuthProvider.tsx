// frontend/src/features/auth/components/AuthProvider.tsx
// src/features/auth/components/AuthProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { tokenService } from '../services/tokenService';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!tokenService.getToken()
  );

  const login = async (username: string, password: string) => {
    await authService.login(username, password);
    setIsAuthenticated(true);
  };

  const register = async (username: string, password: string) => {
    await authService.register(username, password);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

