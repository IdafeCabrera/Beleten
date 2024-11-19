// frontend/src/components/AuthGuard/AuthGuard.tsx
// frontend/src/components/AuthGuard/AuthGuard.tsx
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { IonSpinner } from '@ionic/react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="ion-text-center ion-padding">
        <IonSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Redirect to="/unauthorized" />;
  }

  return <>{children}</>;
};