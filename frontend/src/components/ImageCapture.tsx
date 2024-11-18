// frontend/src/components/ImageCapture.tsx
import React, { useState } from 'react';
import { 
  IonButton, 
  IonIcon, 
  IonActionSheet, 
  IonImg,
  useIonToast 
} from '@ionic/react';
import { 
  camera, 
  image as imageIcon, 
  close, 
  trash 
} from 'ionicons/icons';
import { photoService } from '../services/photo.service';
import { Photo } from '@capacitor/camera';

interface ImageCaptureProps {
  onImageCapture: (photo: Photo) => void;
  initialImage?: string;
  phraseId?: number;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({
  onImageCapture,
  initialImage,
  phraseId
}) => {
  const [presentToast] = useIonToast();
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialImage);

  const handleImageCapture = async (isCamera: boolean) => {
    try {
      const photo = isCamera 
        ? await photoService.takePhoto()
        : await photoService.pickImage();

      if (photo.webPath) {
        setPhotoUrl(photo.webPath);
        onImageCapture(photo);

        if (phraseId) {
          await photoService.uploadImage(phraseId, photo);
          await presentToast({
            message: 'Imagen subida correctamente',
            duration: 2000,
            color: 'success'
          });
        }
      }
    } catch (error) {
      console.error('Error capturando imagen:', error);
      await presentToast({
        message: 'Error al capturar la imagen',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  const handleRemoveImage = () => {
    setPhotoUrl(undefined);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {photoUrl ? (
        <div className="relative w-full max-w-md">
          <IonImg 
            src={photoUrl} 
            alt="Imagen capturada" 
            className="w-full rounded-lg shadow-md" 
          />
          <IonButton
            fill="clear"
            className="absolute top-2 right-2"
            onClick={() => setShowActionSheet(true)}
          >
            <IonIcon icon={close} />
          </IonButton>
        </div>
      ) : (
        <IonButton
          expand="block"
          onClick={() => setShowActionSheet(true)}
          className="w-full"
        >
          <IonIcon slot="start" icon={camera} />
          Añadir Imagen
        </IonButton>
      )}

      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={[
          {
            text: 'Tomar Foto',
            icon: camera,
            handler: () => handleImageCapture(true)
          },
          {
            text: 'Elegir de Galería',
            icon: imageIcon,
            handler: () => handleImageCapture(false)
          },
          {
            text: 'Eliminar',
            role: 'destructive',
            icon: trash,
            handler: handleRemoveImage
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            icon: close
          }
        ]}
      />
    </div>
  );
};

export default ImageCapture;