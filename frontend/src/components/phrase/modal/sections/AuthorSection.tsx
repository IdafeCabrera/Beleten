// frontend/src/components/phrase/modal/sections/AuthorSection.tsx
import React from 'react';
import { IonItem, IonLabel, IonInput } from '@ionic/react';
import { Phrase } from '../../../../types/Phrase';

interface AuthorSectionProps {
  phrase: Phrase | null;
  onAuthorChange: (author: string) => void;
}

const AuthorSection: React.FC<AuthorSectionProps> = ({ phrase, onAuthorChange }) => {
  return (
    <IonItem>
      <IonLabel position="stacked">Autor</IonLabel>
      <IonInput
        value={phrase?.author || ''}
        onIonChange={(e) => onAuthorChange(e.detail.value || '')}
        placeholder="Nombre del autor"
      />
    </IonItem>
  );
};

export default AuthorSection;