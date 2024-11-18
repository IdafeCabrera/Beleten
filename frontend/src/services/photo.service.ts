// frontend/src/services/photo.service.ts
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { toastService } from './toast.service';

export class PhotoService {
  public async takePhoto(): Promise<Photo> {
    try {
      return await Camera.getPhoto({
        resultType: CameraResultType.Base64, // Cambiamos a Base64
        source: CameraSource.Camera,
        quality: 100,
        width: 1024,
        correctOrientation: true
      });
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      throw new Error(`Error al tomar la foto: ${error}`);
    }
  }

  public async pickImage(): Promise<Photo> {
    try {
      return await Camera.getPhoto({
        resultType: CameraResultType.Base64, // Cambiamos a Base64
        source: CameraSource.Photos,
        quality: 100,
        width: 1024,
        correctOrientation: true
      });
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      throw new Error(`Error al seleccionar la imagen: ${error}`);
    }
  }

  public async uploadImage(phraseId: number, photo: Photo): Promise<string> {
    try {
      console.log('📤 Iniciando subida de imagen para frase:', phraseId);
      
      const formData = new FormData();
      
      if (photo.base64String) {
        // Convertir Base64 a Blob
        const byteString = atob(photo.base64String);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: 'image/jpeg' });
        formData.append('file', blob, `phrase_${phraseId}_${Date.now()}.jpg`);
      } else if (photo.webPath) {
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        formData.append('file', blob, `phrase_${phraseId}_${Date.now()}.jpg`);
      } else {
        throw new Error('No se encontró contenido de imagen válido');
      }

      console.log('📤 Enviando formData al servidor...');
      
      const uploadResponse = await fetch(`/api/phrases/${phraseId}/image`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error(`Error en la subida: ${uploadResponse.statusText}`);
      }

      const result = await uploadResponse.json();
      console.log('✅ Imagen subida correctamente:', result);
      
      return result.filename;
    } catch (error) {
      console.error('❌ Error al subir la imagen:', error);
      throw error;
    }
  }
}

export const photoService = new PhotoService();