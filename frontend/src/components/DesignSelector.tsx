// frontend/src/components/DesignSelector.tsx
import React from 'react';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import {
  cardOutline,
  appsOutline,
  gridOutline,
  listOutline,
} from "ionicons/icons";
import { CardDesign } from "../types/CardDesign";
import './DesignSelector.css';

interface DesignSelectorProps {
  selectedDesign: CardDesign;
  onDesignChange: (design: CardDesign) => void;
}

const DesignSelector: React.FC<DesignSelectorProps> = ({
  selectedDesign,
  onDesignChange,
}) => {
  return (
    <IonSegment
      value={selectedDesign}
      onIonChange={(e) => onDesignChange(e.detail.value as CardDesign)}
    >
      <IonSegmentButton value={CardDesign.CLASSIC}>
        <IonIcon icon={cardOutline} />
        <IonLabel>Clásico</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value={CardDesign.MODERN}>
        <IonIcon icon={appsOutline} />
        <IonLabel>Moderno</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value={CardDesign.GRADIENT}>
        <IonIcon icon={gridOutline} />
        <IonLabel>Gradiente</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value={CardDesign.MINIMAL}>
        <IonIcon icon={listOutline} />
        <IonLabel>Minimal</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

export default DesignSelector;