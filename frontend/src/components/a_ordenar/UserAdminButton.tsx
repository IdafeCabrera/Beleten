// frontend/src/components/UserAdminButton.tsx
import { IonButton, IonIcon, IonToast } from '@ionic/react';
import { copyOutline, shareOutline, pencil, trash } from 'ionicons/icons';
import { useState } from 'react';
import { Clipboard } from '@capacitor/clipboard';
import { Phrase } from "../../features/phrases/types/phrase.types";


interface UserAdminButtonProps {
  text: string;
  author?: string | null;
  phrase: Phrase;
  onEdit: (phrase: Phrase) => void; // Especificar que recibe una frase
  onDelete: (id: number) => Promise<void>;
}




interface PhraseItemProps {


}
const UserAdminButton: React.FC<UserAdminButtonProps> = ({ text, author, phrase, onEdit, onDelete }) => {

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  

  const handleCopy = async () => {
    try {
      const textToCopy = author 
        ? `${text}\n— ${author}`
        : text;

      // Intentar primero con Capacitor Clipboard
      try {
        await Clipboard.write({
          string: textToCopy
        });
        setToastMessage('¡Copiado al portapapeles!');
        setShowToast(true);
      } catch (capacitorError) {
        // Si falla Capacitor, intentar con el API web
        await navigator.clipboard.writeText(textToCopy);
        setToastMessage('¡Copiado al portapapeles!');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Error al copiar:', err);
      setToastMessage('Error al copiar al portapapeles');
      setShowToast(true);
    }
  };


  const handleShare = async () => {
    try {
      // Asegúrate de que author y text están bien definidos
      const textToShare = author 
        ? `${text}\n— ${author}`  // Incluye la frase y el autor
        : text;
  
      // Verificar si la Web Share API está disponible
      if (navigator.share) {
        await navigator.share({
          title: 'Frase para compartir', // Título opcional
          text: textToShare,            // El texto de la frase con el autor
           // URL de la página actual
        });
        setToastMessage('¡Compartido!');
        setShowToast(true);
      } else {
        // Si la Web Share API no está disponible
        setToastMessage('La funcionalidad de compartir no está disponible en este navegador');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Error al compartir:', err);
      setToastMessage('Error al intentar compartir');
      setShowToast(true);
    }
  };
  
  
  

  return (
    <>
      <IonButton fill="clear" onClick={handleCopy}>
        <IonIcon icon={pencil} color="success" />
      </IonButton>
      <IonButton fill="clear" onClick={handleShare}>
      <IonIcon icon={trash} color="danger" />
      </IonButton>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color={toastMessage.includes('Error') ? 'danger' : 'success'}
      />
    </>
  );
};

export default UserAdminButton;