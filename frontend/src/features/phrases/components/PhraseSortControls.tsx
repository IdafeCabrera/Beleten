// frontend/src/components/PhraseSortControls.tsx
// src/components/PhraseSortControls.tsx
import React from 'react';
import { 
  IonSegment, 
  IonSegmentButton, 
  IonLabel, 
  IonIcon,
  IonToolbar,
  IonButtons,
  IonButton
} from '@ionic/react';
import { 
  swapVertical, 
  personOutline, 
  timeOutline,
  pricetagOutline
} from 'ionicons/icons';

// Tipos
export type SortField = 'id' | 'text' | 'author' | 'createdAt' | 'category' | 'tags';
export type SortOrder = 'asc' | 'desc';

interface PhraseSortControlsProps {
  onSortChange: (field: SortField, order: SortOrder) => void;
  currentSort: {
    field: SortField;
    order: SortOrder;
  };
}

const PhraseSortControls: React.FC<PhraseSortControlsProps> = ({
  onSortChange,
  currentSort
}) => {
  return (
    <IonToolbar className="sort-controls">
      <IonSegment 
        value={currentSort.field}
        onIonChange={e => onSortChange(e.detail.value as SortField, currentSort.order)}
        style={{
          background: 'transparent'
        }}
      >
        <IonSegmentButton value="id">
          <IonIcon icon={swapVertical} />
          <IonLabel>ID</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="author">
          <IonIcon icon={personOutline} />
          <IonLabel>Autor</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="createdAt">
          <IonIcon icon={timeOutline} />
          <IonLabel>Fecha</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="category">
          <IonIcon icon={pricetagOutline} />
          <IonLabel>Categoría</IonLabel>
        </IonSegmentButton>
        
      </IonSegment>

      <IonButtons slot="end">
        <IonButton
          onClick={() => onSortChange(currentSort.field, currentSort.order === 'asc' ? 'desc' : 'asc')}
          className="sort-direction-button"
          style={{
            transform: currentSort.order === 'desc' ? 'rotate(180deg)' : 'none'
          }}
        >
          <IonIcon icon={swapVertical} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  );
};

export default PhraseSortControls;