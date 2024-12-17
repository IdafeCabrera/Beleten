// frontend/src/components/DesignFabSelector.tsx
// frontend/src/components/DesingFabSelector.tsx
import React from 'react';
import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import {
  colorPaletteOutline,
  cardOutline,
  appsOutline,
  gridOutline,
  listOutline,
} from "ionicons/icons";
import { CardDesign } from "../../types/CardDesign";
import './DesignFabSelector.css';

interface DesignFabSelectorProps {
  selectedDesign: CardDesign;
  onDesignChange: (design: CardDesign) => void;
}

const DesignFabSelector: React.FC<DesignFabSelectorProps> = ({
  selectedDesign,
  onDesignChange,
}) => {
  const designs = [
    { value: CardDesign.CLASSIC, icon: cardOutline, label: 'Clásico' },
    { value: CardDesign.MODERN, icon: appsOutline, label: 'Moderno' },
    { value: CardDesign.GRADIENT, icon: gridOutline, label: 'Gradiente' },
    { value: CardDesign.MINIMAL, icon: listOutline, label: 'Minimal' },
  ];

  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
      <IonFabButton>
        <IonIcon icon={colorPaletteOutline} />
      </IonFabButton>
      <IonFabList side="top">
        {designs.map(design => (
          <IonFabButton 
            key={design.value}
            onClick={() => onDesignChange(design.value)}
            className={selectedDesign === design.value ? 'selected' : ''}
          >
            <div className="fab-button-content">
              <IonIcon icon={design.icon} />
              <IonLabel>{design.label}</IonLabel>
            </div>
          </IonFabButton>
        ))}
      </IonFabList>
    </IonFab>
  );
};

export default DesignFabSelector;