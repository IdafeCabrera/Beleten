// frontend/src/components/phrase/modal/components/ImagePreview.tsx
import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';
import { toastService } from '../../../../services/toast.service';

interface ImagePreviewProps {
  imageFile: string | null;
  onDelete: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageFile, onDelete }) => {
  return (
    imageFile && (
      <div className="image-preview">
        <img
          src={imageFile}
          alt="Preview"
          style={{
            maxWidth: '20%',
            marginBottom: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          onError={(e) => {
            console.error('❌ Error al cargar la imagen preview:', e);
            toastService.error('Error al mostrar la imagen');
          }}
        />
        <IonButton color="danger" onClick={onDelete}>
          <IonIcon slot="start" icon={trash} />
          Eliminar imagen
        </IonButton>
      </div>
    )
  );
};

export default ImagePreview;