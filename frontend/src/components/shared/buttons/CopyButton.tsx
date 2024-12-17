// frontend/src/components/shared/buttons/CopyButton.tsx
// frontend/src/components/shared/modal/buttons/CopyButton.tsx
import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { copy } from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';
import { toastService } from '../../../services/toast.service';

interface CopyButtonProps {
  text: string;
  author?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, author }) => {
  const handleCopy = async () => {
    try {
      const content = author ? `${text}\n— ${author}` : text;
      await Clipboard.write({ string: content });
      toastService.success('Texto copiado al portapapeles');
    } catch (error) {
      toastService.error('Error al copiar el texto');
    }
  };

  return (
    <IonButton fill="clear" onClick={handleCopy}>
      <IonIcon icon={copy} />
    </IonButton>
  );
};

export default CopyButton;