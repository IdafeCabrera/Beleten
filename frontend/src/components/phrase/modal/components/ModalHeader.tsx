// frontend/src/components/phrase/modal/components/ModalHeader.tsx
import React from 'react';
import { IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { close, expand, contract } from 'ionicons/icons';

interface ModalHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  isExpanded,
  onToggleExpand,
  onClose,
}) => {
  return (
    <IonToolbar>
      <IonTitle>{title}</IonTitle>
      <IonButtons slot="end">
        <IonButton onClick={onToggleExpand}>
          <IonIcon icon={isExpanded ? contract : expand} />
        </IonButton>
        <IonButton onClick={onClose}>
          <IonIcon icon={close} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  );
};

export default ModalHeader;