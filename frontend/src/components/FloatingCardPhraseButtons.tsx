// frontend/src/components/FloatingCardPhraseButtons.tsx
import React, { useState } from 'react';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import {
  ellipsisHorizontal,
  pencil,
  trash,
  heart,
  bookmarkOutline,
  share,
  expand
} from 'ionicons/icons';
import './FloatingCardPhraseButtons.css';

interface FloatingButtonsProps {
  onEdit: (e: React.MouseEvent<HTMLIonButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLIonButtonElement>) => void;
  onExpand: () => void;
}

const FloatingCardPhraseButtons: React.FC<FloatingButtonsProps> = ({ onEdit, onDelete, onExpand }) => {
  

  const handleEdit = (e: React.MouseEvent<HTMLIonButtonElement>) => {
    e.preventDefault();
    onEdit(e);
  };

  const handleDelete = (e: React.MouseEvent<HTMLIonButtonElement>) => {
    e.preventDefault();
    onDelete(e);
  };

  return (
    <div className={`floating-buttons-container ${true ? 'is-visible' : ''}`}>
      <div className="floating-buttons-wrapper">
        <IonFabButton size="small" onClick={() => handleEdit}>
          <IonIcon icon={pencil} />
        </IonFabButton>
        <IonFabButton size="small" onClick={() => handleDelete}>
          <IonIcon icon={trash} />
        </IonFabButton>
        <IonFabButton size="small" onClick={onExpand}>
          <IonIcon icon={expand} />
        </IonFabButton>
        <IonFabButton size="small">
          <IonIcon icon={heart} />
        </IonFabButton>
        <IonFabButton size="small">
          <IonIcon icon={bookmarkOutline} />
        </IonFabButton>
        <IonFabButton size="small">
          <IonIcon icon={share} />
        </IonFabButton>
      </div>
    </div>
  );
};

export default FloatingCardPhraseButtons;