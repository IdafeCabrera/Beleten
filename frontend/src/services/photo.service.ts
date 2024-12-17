// frontend/src/services/photo.service.ts
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { toastService } from './toast.service';
import { config } from '../config/config';
import { CapacitorHttp } from '@capacitor/core';

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


  public async deletePhoto(filename: string): Promise<void> {
    try {
      // Asegúrate de que la ruta sea correcta
      const cleanFilename = filename.startsWith('/images/') ? filename.slice(8) : filename;
  
      const deleteUrl = `${config.baseUrl}/api/photos/${cleanFilename}`;
      console.log(`🗑️ Eliminando foto desde: ${deleteUrl}`);
  
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar la foto: ${response.status}`);
      }
  
      console.log('✅ Foto eliminada exitosamente');
    } catch (error) {
      console.error('❌ Error al eliminar la foto:', error);
      throw new Error(`Error al eliminar la foto: ${error}`);
    }
  }

  


  public async uploadImage(phraseId: number, photo: Photo): Promise<string> {
    try {
      if (!photo.base64String) {
        throw new Error('No base64 data available');
      }

      // Crear un formData nativo
      const formData = new FormData();
      
      // Convertir base64 a blob
      const byteCharacters = atob(photo.base64String.split(',')[1] || photo.base64String);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      formData.append('file', blob, 'photo.jpg');

      // Subir usando fetch nativo
      const uploadUrl = `${config.baseUrl}/api/phrases/${phraseId}/image`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      return data.filename;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }  }

export const photoService = new PhotoService();