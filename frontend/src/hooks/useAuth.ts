// frontend/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../interfaces/auth.interface';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscription = authService.currentUser.subscribe(user => {
      setUser(user);
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    canEditPhrase: authService.canEditPhrase.bind(authService),
    canDeletePhrase: authService.canDeletePhrase.bind(authService)
  };
};