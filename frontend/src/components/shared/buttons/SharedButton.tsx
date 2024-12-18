import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { share } from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';
import { toastService } from '../../../services/toast.service';

interface ShareButtonProps {
  text: string;
  author?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ text, author }) => {
  const shareText = async () => {
    const content = `${text}\n— ${author || ''}`.trim();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(content)}`;

    // Detecta si es móvil o escritorio
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    try {
      if (navigator.share) {
        // Intenta usar Web Share API si está disponible
        await navigator.share({
          title: 'Frase Compartida',
          text: content,
          url: whatsappUrl, // URL incluida para compatibilidad
        });
        console.log('Compartido correctamente');
      } else if (isMobile) {
        // Si es móvil y no soporta Web Share, abre WhatsApp directamente
        window.location.href = whatsappUrl;
      } else {
        // Para escritorio: Copia al portapapeles y abre WhatsApp Web
        await Clipboard.write({ string: content });
        toastService.success('Texto copiado al portapapeles. Pega el texto en WhatsApp.');
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      fallbackToClipboard(content, whatsappUrl);
    }
  };

  const fallbackToClipboard = async (content: string, whatsappUrl: string) => {
    try {
      await Clipboard.write({ string: content });
      toastService.success('Texto copiado al portapapeles. Pega el texto en WhatsApp.');
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error al copiar el texto:', error);
      toastService.error('Error al copiar el texto');
    }
  };

  return (
    <IonButton fill="clear" onClick={shareText}>
      <IonIcon icon={share} />
    </IonButton>
  );
};

export default ShareButton;
