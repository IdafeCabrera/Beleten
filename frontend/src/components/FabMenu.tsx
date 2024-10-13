// /frontend/src/components/FabMenu.tsx
import React from 'react';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';

interface FabMenuProps {
  onClick: () => void; // Función para manejar el clic en el FAB
}

const FabMenu: React.FC<FabMenuProps> = ({ onClick }) => {
  return (
    <IonFab horizontal="end" vertical="bottom" slot="fixed">
      <IonFabButton onClick={onClick}> {/* Llama a la función cuando se hace clic */}
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>
  );
};

export default FabMenu;
