// frontend/src/app/providers/AuthProvider.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { tokenService } from '../../features/auth/services/tokenService';
import { authService } from '../../features/auth/services/authService';
import { fetchUserDetails } from '../../services/user.service';

interface User {
  id: number;
  username: string;
  email: string;
  roleId: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string, roleId: number) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!tokenService.getToken());
  const [user, setUser] = useState<User | null>(null);

  // Cargar usuario al inicializar el contexto si existe un token
  useEffect(() => {
    const loadUserDetails = async () => {
      const token = tokenService.getToken();
      if (token) {
        try {
          const userDetails = await fetchUserDetails(); // Obtener detalles del usuario
          setUser(userDetails);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error al cargar detalles del usuario:", error);
          setIsAuthenticated(false);
          tokenService.removeToken();
        }
      }
    };

    loadUserDetails();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password); // Iniciar sesión y obtener token
      const userDetails = await fetchUserDetails(); // Obtener detalles del usuario

      setUser(userDetails);
      setIsAuthenticated(true);

      console.log('User RoleId:', userDetails.roleId);
      console.log('Is Authenticated:', true);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw new Error("No se pudo iniciar sesión.");
    }
  };

  const register = async (username: string, password: string, email: string, roleId: number) => {
    await authService.register(username, password, email, roleId);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
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
