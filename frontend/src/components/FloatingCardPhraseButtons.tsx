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

interface FloatingCardPhraseButtonsProps {
  onExpand: () => void;
}

const FloatingCardPhraseButtons: React.FC<FloatingCardPhraseButtonsProps> = ({ onExpand }) => {
  
  return (
    <div className={`floating-buttons-container1 ${true ? 'is-visible' : ''}`}>
      <div className="floating-buttons-wrapper1">

        <IonFabButton size="small" onClick={onExpand}>
          <IonIcon icon={expand} />
        </IonFabButton>

      </div>
    </div>
  );
};

export default FloatingCardPhraseButtons;