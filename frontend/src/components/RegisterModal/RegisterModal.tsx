// frontend/src/components/RegisterModal/RegisterModal.tsx
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
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonText
} from '@ionic/react';
import { close, personAdd } from 'ionicons/icons';
import { authService } from '../../services/auth.service';
import { toastService } from '../../services/toast.service';
import './RegisterModal.css';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<RegisterForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};
    
    if (formData.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email no válido';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleRegister = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const { confirmPassword, ...registerData } = formData;
      
      const success = await authService.register(registerData);
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error en registro:', error);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro de Usuario</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div className="register-form">
          <IonItem className={errors.username ? 'ion-invalid' : ''}>
            <IonLabel position="floating">Usuario</IonLabel>
            <IonInput
              value={formData.username}
              onIonChange={e => handleInputChange('username', e.detail.value || '')}
              placeholder="Ingresa tu nombre de usuario"
            />
            {errors.username && (
              <IonText color="danger" className="error-message">
                {errors.username}
              </IonText>
            )}
          </IonItem>

          <IonItem className={errors.email ? 'ion-invalid' : ''}>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={formData.email}
              onIonChange={e => handleInputChange('email', e.detail.value || '')}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && (
              <IonText color="danger" className="error-message">
                {errors.email}
              </IonText>
            )}
          </IonItem>

          <IonItem className={errors.password ? 'ion-invalid' : ''}>
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput
              type="password"
              value={formData.password}
              onIonChange={e => handleInputChange('password', e.detail.value || '')}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <IonText color="danger" className="error-message">
                {errors.password}
              </IonText>
            )}
          </IonItem>

          <IonItem className={errors.confirmPassword ? 'ion-invalid' : ''}>
            <IonLabel position="floating">Confirmar Contraseña</IonLabel>
            <IonInput
              type="password"
              value={formData.confirmPassword}
              onIonChange={e => handleInputChange('confirmPassword', e.detail.value || '')}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && (
              <IonText color="danger" className="error-message">
                {errors.confirmPassword}
              </IonText>
            )}
          </IonItem>

          <IonButton
            expand="block"
            className="ion-margin-top register-button"
            onClick={handleRegister}
          >
            <IonIcon icon={personAdd} slot="start" />
            Registrarse
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default RegisterModal;