// frontend/src/components/layout/Layout/components/ScrollButtons/ScrollButtons.tsx
import React, { memo } from 'react';
import { IonFabButton, IonIcon } from '@ionic/react';
import { arrowUpCircle, home, saveOutline } from 'ionicons/icons';
import { BUTTON_CONFIG } from './ScrollButtons.constants';
import type { ScrollButtonsProps } from '../../Layout.types';
import './ScrollButtons.css';
import {
  star,
  heart,
  sparkles,

  personCircle,
  notifications,
  settings,
  call,
  mail,
  add,
  remove,
  share,
} from "ionicons/icons";
import ExpandableFab from '../../../../a_ordenar/ExpandableFab';

const fabButtons = [
  { icon: call, label: "Llamar", onClick: () => console.log("Call clicked") },
  { icon: mail, label: "Correo", onClick: () => console.log("Mail clicked") },
  { icon: settings, label: "Ajustes", onClick: () => console.log("Settings clicked") },
  { icon: add, onClick: () => console.log("Add clicked") },
  { icon: remove, onClick: () => console.log("Remove clicked") },
  { icon: star, onClick: () => console.log("Star clicked") },
  { icon: heart, onClick: () => console.log("Heart clicked") },
  { icon: share, onClick: () => console.log("Share clicked") },
];

export const ScrollButtons = memo<ScrollButtonsProps>(({
  visible,
  onScrollTop,
  onHomeClick,
}) => (
  <div className={`floating-buttons-container ${visible ? 'is-visible' : ''}`}>
   
    <div className="floating-buttons-wrapper">
    {/* <ExpandableFab buttons={fabButtons} vertical={true} /> */}
      <IonFabButton
        size={BUTTON_CONFIG.SIZE}
        color={BUTTON_CONFIG.COLOR}
        onClick={onHomeClick}
        aria-label="Ir a inicio"
      >
        <IonIcon icon={home} />
      </IonFabButton>

      <IonFabButton
        size={BUTTON_CONFIG.SIZE}
        color={BUTTON_CONFIG.COLOR}
        onClick={onScrollTop}
        aria-label="Volver arriba"
      >
        <IonIcon icon={arrowUpCircle} />
      </IonFabButton>
      
      <IonFabButton
        size={BUTTON_CONFIG.SIZE}
        color={BUTTON_CONFIG.COLOR}
        aria-label="Guardar"
      >
        <IonIcon icon={saveOutline} />
      </IonFabButton>
      
      
      
    </div>
  </div>
));

ScrollButtons.displayName = 'ScrollButtons';