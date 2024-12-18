// frontend/src/components/layout/AppBar.tsx
import React, { useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { personCircle, logOut, home, logIn, personAdd, documentTextOutline, clipboardOutline, personCircleOutline, gameControllerOutline, peopleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom'; // Importar useNavigate
import styles from '../layout/styles/AppBar.module.css';

interface AppBarProps {
  title: string; // Nombre de la página
  isAuthenticated: boolean; // Estado de autenticación
  onLogin?: () => void; // Acción al hacer clic en "Iniciar Sesión"
  onRegister?: () => void; // Acción al hacer clic en "Registrarse"
  onLogout?: () => void; // Acción al hacer clic en "Cerrar Sesión"
  onAvatarClick?: () => void; // Acción al hacer clic en el avatar
}

const AppBar: React.FC<AppBarProps> = ({
  title,
  isAuthenticated,
  onLogin = () => console.log('Iniciar sesión'),
  onRegister = () => console.log('Registrarse'),
  onLogout = () => console.log('Cerrar sesión'),
  onAvatarClick = () => console.log('Perfil'),
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const navigate = useHistory(); // Hook de navegación

  const handleLogin = () => {
    console.log('Iniciar sesión');
    navigate.push('/login');
  };

  const handleRegister = () => {
    console.log('Registrarse');
    navigate.push('/register');
  };

  const handleLogout = () => {
    console.log('Cerrar sesión');
    navigate.push('/');
    onLogout(); // Llama a la función pasada por props
  };

  const handleProfile = () => {
    console.log('Perfil');
    navigate.push('/dashboard');
    onAvatarClick(); // Llama a la función pasada por props
  };

  return (
    <IonHeader>
      <IonToolbar>
        {/* Título de la página */}
        
        <IonButton routerLink="/home">HOME</IonButton>

        {/* Botones de navegación */}
        <IonButtons slot="end">
          {isAuthenticated ? (
            <IonButton onClick={() => setShowPopover(true)} aria-label="Abrir menú de usuario">
              <IonIcon icon={personCircle} slot="icon-only" />
            </IonButton>
          ) : (
            <>
              <IonButton onClick={handleLogin} aria-label="Iniciar sesión">
                <IonIcon icon={logIn} slot="start" />
                <IonLabel>Iniciar Sesión</IonLabel>
              </IonButton>
              <IonButton onClick={handleRegister} aria-label="Registrarse">
                <IonIcon icon={personAdd} slot="start" />
                <IonLabel>Registrarse</IonLabel>
              </IonButton>
            </>
          )}
        </IonButtons>

        {/* Popover para opciones del usuario */}
        <IonPopover
          isOpen={showPopover}
          onDidDismiss={() => setShowPopover(false)}
          className={styles.popover}
        >
          <IonList>
            <IonItem button onClick={handleProfile}>
              <IonIcon icon={personCircleOutline} slot="start" />
              <IonLabel>Mi Perfil</IonLabel>
            </IonItem>
            <IonItem button routerLink="/home">
              <IonIcon icon={home} slot="start" />
              <IonLabel>Home</IonLabel>
          
            </IonItem>
            <IonItem button routerLink="/phrases">
              <IonIcon icon={documentTextOutline} slot="start"/>
       
              <IonLabel>Frases</IonLabel>
            </IonItem>

            <IonItem button routerLink="/users">
              <IonIcon icon={peopleOutline} slot="start"/>
       
              <IonLabel>Usuarios</IonLabel>
            </IonItem>

            <IonItem button routerLink="/roles">
              <IonIcon icon={gameControllerOutline} slot="start"/>
       
              <IonLabel>Roles</IonLabel>
            </IonItem>
            <IonItem button onClick={handleLogout}>
              <IonIcon icon={logOut} slot="start" />
              <IonLabel>Cerrar Sesión</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppBar;
