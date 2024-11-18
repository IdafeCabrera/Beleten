// frontend/src/components/phrase/modal/components/ModalFooter.tsx
import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { save } from 'ionicons/icons';
import { PhraseFormData } from '../../../../types/Phrase';

interface ModalFooterProps {
  onSave: (phraseData: PhraseFormData) => void;
  isSubmitting: boolean;
  isEditable: boolean;
  hasChanges: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  onSave,
  isSubmitting,
  isEditable,
  hasChanges,
}) => {
  return (
    <div className="modal-footer">
      <IonButton
        expand="block"
        onClick={() => onSave({ /* pass phrase data */ })}
        disabled={isSubmitting || !isEditable || !hasChanges}
      >
        <IonIcon icon={save} slot="start" />
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </IonButton>
    </div>
  );
};

export default ModalFooter;