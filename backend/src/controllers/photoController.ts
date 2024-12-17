// backend/src/controllers/photoController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Phrase from '../models/Phrase'; // Si necesitas actualizar el modelo

export const deletePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;

    // Construir la ruta completa del archivo
    const filePath = path.join(__dirname, '../../public/images', filename);

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'Imagen no encontrada' });
      return;
    }

    // Eliminar el archivo del sistema de archivos
    fs.unlinkSync(filePath);

    // Si hay una referencia en la base de datos, actualízala
    const phrase = await Phrase.findOne({ where: { filename: `/images/${filename}` } });
    if (phrase) {
      await phrase.update({ filename: null }); // Eliminar la referencia de la base de datos
    }

    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    res.status(500).json({ message: 'Error interno al eliminar la imagen' });
  }
};
