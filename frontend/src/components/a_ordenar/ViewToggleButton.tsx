// frontend/src/components/ViewToggleButton.tsx
import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { gridOutline, listOutline } from 'ionicons/icons';
import './ViewToggleButton.css';

interface ViewToggleButtonProps {
  viewType: 'grid' | 'list';
  onChange: (viewType: 'grid' | 'list') => void;
}

const ViewToggleButton: React.FC<ViewToggleButtonProps> = ({ viewType, onChange }) => {
  return (
    <div className="view-toggle-container">
      <button 
        className={`view-toggle-button ${viewType}`}
        onClick={() => onChange(viewType === 'grid' ? 'list' : 'grid')}
        title={`Cambiar a vista ${viewType === 'grid' ? 'lista' : 'cuadrícula'}`}
      >
        <div className="toggle-icons">
          <IonIcon 
            icon={gridOutline} 
            className={`toggle-icon grid ${viewType === 'grid' ? 'active' : ''}`}
          />
          <IonIcon 
            icon={listOutline} 
            className={`toggle-icon list ${viewType === 'list' ? 'active' : ''}`}
          />
        </div>
        <div className="toggle-slider" />
      </button>
    </div>
  );
};

export default ViewToggleButton;