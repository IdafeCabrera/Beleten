// frontend/src/components/layout/Layout.tsx
import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import AppBar from './AppBar';
import { useAuth } from '../../app/providers/AuthProvider';
import { useAppActions } from '../../app/providers/AppActionsContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
    const { isAuthenticated } = useAuth(); // Obtener el estado desde el contexto
  const { handleLogout, handleLogin, handleRegister, goToDashboard } = useAppActions();

  return (
    <IonPage>
      <AppBar
        title={title}
        isAuthenticated={isAuthenticated} 
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        onAvatarClick={goToDashboard}
      />
      <IonContent>{children}</IonContent>
    </IonPage>
  );
};

export default Layout;
