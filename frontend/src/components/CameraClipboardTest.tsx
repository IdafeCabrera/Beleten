// frontend/src/components/CameraClipboardTest.tsx
// frontend/src/components/CameraClipboardTest.tsx
import React, { useState } from 'react';
import { IonButton, IonImg, IonToast } from '@ionic/react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Clipboard } from '@capacitor/clipboard';

const CameraClipboardTest: React.FC = () => {
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
      });
      
      setPhotoUrl(image.webPath);
    } catch (error) {
      console.error('Error taking photo:', error);
      setToastMessage('Error al tomar la foto');
      setShowToast(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.write({
        string: "Texto copiado desde Beleten App"
      });
      setToastMessage('Texto copiado al portapapeles');
      setShowToast(true);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setToastMessage('Error al copiar al portapapeles');
      setShowToast(true);
    }
  };

  const readFromClipboard = async () => {
    try {
      const { type, value } = await Clipboard.read();
      setToastMessage(`Contenido del portapapeles: ${value}`);
      setShowToast(true);
    } catch (error) {
      console.error('Error reading from clipboard:', error);
      setToastMessage('Error al leer del portapapeles');
      setShowToast(true);
    }
  };

  return (
    <div className="ion-padding">
      <IonButton expand="block" onClick={takePicture}>
        Tomar Foto
      </IonButton>
      
      {photoUrl && (
        <IonImg 
          src={photoUrl} 
          style={{ 
            marginTop: '1rem',
            maxWidth: '100%',
            borderRadius: '8px'
          }} 
        />
      )}

      <IonButton expand="block" onClick={copyToClipboard} style={{ marginTop: '1rem' }}>
        Copiar al Portapapeles
      </IonButton>

      <IonButton expand="block" onClick={readFromClipboard} style={{ marginTop: '1rem' }}>
        Leer del Portapapeles
      </IonButton>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
      />
    </div>
  );
};

export default CameraClipboardTest;