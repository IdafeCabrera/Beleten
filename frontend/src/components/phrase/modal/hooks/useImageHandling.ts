// frontend/src/components/phrase/modal/hooks/useImageHandling.ts
import { useState } from 'react';
import { Photo } from '@capacitor/camera';
import { photoService } from '../../../../services/photo.service';
import { toastService } from '../../../../services/toast.service';
import { apiService } from '../../../../services/api.service';
import { Phrase } from '../../../../types/Phrase';





const useImageHandling = (
phrase: Phrase | null,
  initialImageFile: string | null,
  useDefaultImage: boolean,
  onImageChange: (photo: Photo | null) => void
) => {
  const [imageFile, setImageFile] = useState<string | null>(initialImageFile);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);

  const handleTakePhoto = async () => {
    try {
      console.log('📸 Iniciando captura de foto...');
      setIsUploadingImage(true);

      const photo = await photoService.takePhoto();
      console.log('📸 Foto capturada:', photo);

      if (photo.webPath) {
        console.log('📸 WebPath disponible:', photo.webPath);
        setImageFile(photo.webPath);
        setCurrentPhoto(photo);
      } else if (photo.base64String) {
        console.log('📸 Base64 disponible');
        setImageFile(`data:image/jpeg;base64,${photo.base64String}`);
        setCurrentPhoto(photo);
      }
    } catch (error) {
      console.error('❌ Error al tomar la foto:', error);
      toastService.error('Error al tomar la foto');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePickImage = async () => {
    try {
      console.log('🖼️ Iniciando selección de imagen...');
      setIsUploadingImage(true);

      const photo = await photoService.pickImage();
      console.log('🖼️ Imagen seleccionada:', photo);

      if (photo.webPath) {
        console.log('🖼️ WebPath disponible:', photo.webPath);
        setImageFile(photo.webPath);
        setCurrentPhoto(photo);
      } else if (photo.base64String) {
        console.log('🖼️ Base64 disponible');
        setImageFile(`data:image/jpeg;base64,${photo.base64String}`);
        setCurrentPhoto(photo);
      }
    } catch (error) {
      console.error('❌ Error al seleccionar la imagen:', error);
      toastService.error('Error al seleccionar la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      if (!phrase?.id) return;

      await apiService.put(`phrases/${phrase.id}`, {
        ...phrase,
        filename: null,
        default_background_image: useDefaultImage ? 'url_to_default_image' : null,
      });

      setImageFile(null);
      toastService.success('Imagen eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      toastService.error('Error al eliminar la imagen');
    }
  };

  return {
    imageFile,
    isUploadingImage,
    currentPhoto,
    handleTakePhoto,
    handlePickImage,
    handleDeleteImage,
  };
};

export default useImageHandling;