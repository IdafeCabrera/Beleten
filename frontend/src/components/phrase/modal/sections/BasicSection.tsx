// frontend/src/components/phrase/modal/sections/BasicSection.tsx
import React, { useState } from 'react';
import { IonItem, IonLabel, IonTextarea, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import { Phrase } from '../../../../types/Phrase';
import TagInput from '../components/TagInput';

interface BasicSectionProps {
  phrase: Phrase | null;
  onPhraseTextChange: (text: string) => void;
  onCategoryChange: (category: string) => void;
  onTagArrayChange: (tags: string[]) => void;
}

const BasicSection: React.FC<BasicSectionProps> = ({
  phrase,
  onPhraseTextChange,
  onCategoryChange,
  onTagArrayChange,
}) => {
  const [tagArray, setTagArray] = useState<string[]>(phrase?.tags?.es || []);

  const handleTagArrayChange = (newTags: string[]) => {
    setTagArray(newTags);
    onTagArrayChange(newTags);
  };

  return (
    <>
      <IonItem>
        <IonLabel position="stacked">Texto</IonLabel>
        <IonTextarea
          value={phrase?.text || ''}
          onIonChange={(e) => onPhraseTextChange(e.detail.value || '')}
          placeholder="Texto de la frase"
          autoGrow={true}
          className="custom-textarea"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Categoría</IonLabel>
        <IonSelect
          value={phrase?.category || ''}
          onIonChange={(e) => onCategoryChange(e.detail.value || '')}
        >
          <IonSelectOption value="filosofía">Filosofía</IonSelectOption>
          <IonSelectOption value="ciencia">Ciencia</IonSelectOption>
          <IonSelectOption value="literatura">Literatura</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Etiquetas</IonLabel>
        <TagInput
          tags={tagArray}
          onTagsChange={handleTagArrayChange}
          placeholder="Presiona Enter para añadir"
        />
      </IonItem>
    </>
  );
};

export default BasicSection;