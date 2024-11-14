// frontend/src/components/ExpandableFab.tsx
// ExpandableFab.tsx
import React, { useState } from 'react';
import { IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/react';
import { chevronUpCircle } from 'ionicons/icons';
import './ExpandableFab.css';

interface FabButton {
  icon: string;
  onClick: () => void;
}

interface ExpandableFabProps {
  buttons: FabButton[];
  vertical?: boolean;
}

const ExpandableFab: React.FC<ExpandableFabProps> = ({ buttons, vertical = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFab = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
      
      <IonFabButton onClick={toggleFab} className={isOpen ? 'fab-button-open' : ''}>
        <IonIcon icon={chevronUpCircle} />
      </IonFabButton>
      <IonFabList side={vertical ? 'top' : 'start'} className={`custom-fab-list ${isOpen ? 'open' : ''}`}>
        <div className={`fab-scroll-container ${vertical ? 'vertical' : 'horizontal'}`}>
          {buttons.map((button, index) => (
            <IonFabButton key={index} onClick={button.onClick} className="scrollable-fab-button">
              <IonIcon icon={button.icon} />
            </IonFabButton>
          ))}
        </div>
      </IonFabList>
    </IonFab>
  );
};

export default ExpandableFab;
