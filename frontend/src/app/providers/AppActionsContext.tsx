// frontend/src/app/providers/AppActionsContext.tsx
// frontend/src/contexts/AppActionsContext.tsx
import React, { createContext, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface AppActionsContextType {
  handleLogout: () => void;
  goToDashboard: () => void;
  handleLogin: () => void;
  handleRegister: () => void;
}

const AppActionsContext = createContext<AppActionsContextType | undefined>(undefined);

export const AppActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const history = useHistory();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    console.log('Cerrando sesión...');
    history.push('/login');
  };

  const goToDashboard = () => {
    console.log('Redirigiendo al Dashboard...');
    history.push('/dashboard');
  };

  const handleLogin = () => {
    console.log('Redirigir a Login');
    history.push('/login');
  };

  const handleRegister = () => {
    console.log('Redirigir a Register');
    history.push('/register');
  };

  return (
    <AppActionsContext.Provider
      value={{ handleLogout, goToDashboard, handleLogin, handleRegister }}
    >
      {children}
    </AppActionsContext.Provider>
  );
};

export const useAppActions = (): AppActionsContextType => {
  const context = useContext(AppActionsContext);
  if (!context) {
    throw new Error('useAppActions must be used within an AppActionsProvider');
  }
  return context;
};
