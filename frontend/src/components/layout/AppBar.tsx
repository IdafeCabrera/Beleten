// frontend/src/components/layout/AppBar.tsx
// frontend/src/layout/components/AppBar.tsx
import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonPopover, IonList, IonItem } from '@ionic/react';
import { personCircle, logOut, home, logIn, personAdd } from 'ionicons/icons';
import styles from '../layout/styles/AppBar.module.css';

interface AppBarProps {
  title: string; // El nombre de la página
  isAuthenticated: boolean; // Estado de autenticación
  onLogin?: () => void; // Acción al hacer clic en "Iniciar Sesión"
  onRegister?: () => void; // Acción al hacer clic en "Registrarse"
  onLogout?: () => void; // Acción al hacer clic en "Cerrar Sesión"
  onAvatarClick?: () => void; // Acción al hacer clic en el avatar
}

const AppBar: React.FC<AppBarProps> = ({ title, isAuthenticated, onLogin, onRegister, onLogout, onAvatarClick }) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <IonHeader>
      <IonToolbar>
        {/* Título de la página */}
        <IonTitle>{title}</IonTitle>

        {/* Botones de navegación comunes */}
        <IonButtons slot="end">
          {isAuthenticated ? (
            <IonButton onClick={() => setShowPopover(true)}>
              <IonIcon icon={personCircle} slot="icon-only" />
            </IonButton>
          ) : (
            <>
              <IonButton onClick={onLogin}>
                <IonIcon icon={logIn} slot="start" />
              </IonButton>
              <IonButton onClick={onRegister}>
                <IonIcon icon={personAdd} slot="start" />
              </IonButton>
            </>
          )}
        </IonButtons>

        {/* Popover para opciones del avatar */}
        <IonPopover
          isOpen={showPopover}
          onDidDismiss={() => setShowPopover(false)}
          className={styles.popover}
        >
          <IonList>
            <IonItem button onClick={onAvatarClick}>
              <IonIcon icon={home} slot="start" />
              Mi Perfil
            </IonItem>
            <IonItem button onClick={onLogout}>
              <IonIcon icon={logOut} slot="start" />
              Cerrar Sesión
            </IonItem>
          </IonList>
        </IonPopover>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppBar;
