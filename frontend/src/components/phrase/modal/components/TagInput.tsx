// frontend/src/components/phrase/modal/components/TagInput.tsx
import React, { useState, KeyboardEvent } from 'react';
import { IonInput, IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, placeholder }) => {
  const [newTag, setNewTag] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <IonInput
        value={newTag}
        onIonChange={(e) => setNewTag(e.detail.value || '')}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        clearOnEdit={true}
      />
      <div className="tag-container">
        {tags.map((tag, index) => (
          <IonChip key={index} onClick={() => handleRemoveTag(index)}>
            {tag}
            <IonIcon icon={closeCircle} />
          </IonChip>
        ))}
      </div>
    </>
  );
};

export default TagInput;