// frontend/src/components/shared/modal/DeleteConfirmation.tsx
import React from 'react';
import { IonAlert } from '@ionic/react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  return (
    <IonAlert
      isOpen={isOpen}
      header="Confirmar eliminación"
      message="¿Estás seguro de que deseas eliminar esta frase?"
      buttons={[
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: onCancel
        },
        {
          text: 'Eliminar',
          handler: onConfirm
        }
      ]}
    />
  );
};

export default DeleteConfirmation;