// frontend/src/components/phrase/modal/sections/MediaSection.tsx
import React, { useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonSpinner, IonToggle } from '@ionic/react';
import { camera, images, trash } from 'ionicons/icons';
import { Photo } from '@capacitor/camera';
import useImageHandling  from '../hooks/useImageHandling';
import ImagePreview  from '../components/ImagePreview';
import { Phrase } from '../../../../types/Phrase';


interface MediaSectionProps {
  phrase: Phrase | null;
  onImageChange: (photo: Photo | null) => void;
  onUseDefaultImageChange: (useDefault: boolean) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({
  phrase,
  onImageChange,
  onUseDefaultImageChange,
}) => {
    const [useDefaultImage, setUseDefaultImage] = useState(!!phrase?.default_background_image);
  const { imageFile, isUploadingImage, currentPhoto, handleTakePhoto, handlePickImage, handleDeleteImage } =
  useImageHandling(
    phrase,
    phrase?.filename || null,
    useDefaultImage,
    (photo: Photo | null) => onImageChange(photo)
  );


  const handleUseDefaultImageChange = (e: { detail: { checked: boolean } }) => {
    setUseDefaultImage(e.detail.checked);
    onUseDefaultImageChange(e.detail.checked);
  };

  return (
    <div className="ion-padding">
      <IonItem>
        <IonLabel>Usar imagen por defecto</IonLabel>
        <IonToggle checked={useDefaultImage} onIonChange={handleUseDefaultImageChange} />
      </IonItem>

      {isUploadingImage && (
        <div className="loading-overlay">
          <IonSpinner />
          <p>Procesando imagen...</p>
        </div>
      )}

      <ImagePreview imageFile={imageFile} onDelete={handleDeleteImage} />

      <div className="ion-margin-vertical">
        <IonButton onClick={handleTakePhoto} disabled={isUploadingImage}>
          <IonIcon slot="start" icon={camera} />
          {isUploadingImage ? 'Procesando...' : 'Tomar Foto'}
        </IonButton>

        <IonButton onClick={handlePickImage} disabled={isUploadingImage}>
          <IonIcon slot="start" icon={images} />
          {isUploadingImage ? 'Procesando...' : 'Seleccionar Imagen'}
        </IonButton>
      </div>
    </div>
  );
};

export default MediaSection;