// frontend/src/components/LoginModal.tsx
import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonIcon
} from '@ionic/react';
import { close, logIn } from 'ionicons/icons';
import { authService } from '../services/auth.service';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (await authService.login(username, password)) {
      onSuccess();
      onClose();
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesión</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Usuario</IonLabel>
          <IonInput
            value={username}
            onIonChange={e => setUsername(e.detail.value || '')}
            placeholder="Introduce tu usuario"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Contraseña</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={e => setPassword(e.detail.value || '')}
            placeholder="Introduce tu contraseña"
          />
        </IonItem>
        <IonButton
          expand="block"
          onClick={handleLogin}
          className="ion-margin-top"
        >
          <IonIcon icon={logIn} slot="start" />
          Iniciar Sesión
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default LoginModal;