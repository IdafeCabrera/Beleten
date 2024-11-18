// backend/src/routes/phraseRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import Phrase from '../models/Phrase';
import { GenericController } from '../controllers/GenericController';
import upload from '../multer/upload';
import path from 'path';
import fs from 'fs';

// Interfaces mejoradas
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

interface ImageUploadResponse {
  message: string;
  filename: string;
}

// Tipo para el manejador de la ruta de imagen
type ImageUploadHandler = (
  req: MulterRequest,
  res: Response<ImageUploadResponse>,
  next: NextFunction
) => Promise<void>;

// Interfaces
interface TypedRequest<T = any> extends Request {
  body: T;
}

interface TypedRequestWithFile extends TypedRequest {
  file?: Express.Multer.File;
  params: ParamsDictionary;
}

// Definir la interfaz para el request con el archivo
interface RequestWithFile extends Request {
  file: Express.Multer.File;
}

const phraseController = new GenericController(Phrase);
const router = Router();


// Asegúrate de que el directorio de imágenes existe
const imagesDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Rutas genéricas
router.get('/', (req, res) => phraseController.getAll(req, res));
router.post('/', (req, res) => phraseController.create(req, res));
router.put('/:id', (req, res) => phraseController.update(req, res));
router.delete('/:id', (req, res) => phraseController.delete(req, res));
router.put('/:id/favorite', (req, res) => phraseController.toggleFavorite(req, res));


// Ruta para la inserción masiva
router.post('/bulk', async (req, res) => {
    try {
      const phrases = req.body; // Los datos que llegan en el body
      const createdFrases = await Phrase.bulkCreate(phrases, { validate: true });
      res.status(201).json(createdFrases);
    } catch (error) {
      res.status(500).json({ message: 'Error al insertar frases', error });
    }
  });

// Ruta personalizada para actualizar la apariencia visual de una frase
router.put('/:id/visual', (req, res) => phraseController.updateVisual(req, res));



// Ruta para subir imagen con tipos corregidos
router.post(
  '/:id/image',
  upload.single('file'),
  (async (req: MulterRequest, res: Response<ImageUploadResponse>, next: NextFunction) => {
    try {
      const phraseId = req.params.id;
      const phrase = await Phrase.findByPk(phraseId);

      if (!phrase) {
        res.status(404).json({ 
          message: 'Frase no encontrada',
          filename: ''
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({ 
          message: 'No se ha proporcionado ninguna imagen',
          filename: ''
        });
        return;
      }

      // Construir la ruta de la imagen
      const imageUrl = `/images/${req.file.filename}`;

      // Si ya existe una imagen anterior, eliminarla
      if (phrase.filename) {
        const oldImagePath = path.join(__dirname, '../../public', phrase.filename);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Actualizar la frase con la nueva ruta de la imagen
      await phrase.update({
        filename: imageUrl
      });

      res.status(200).json({
        message: 'Imagen subida correctamente',
        filename: imageUrl
      });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      next(error);
    }
  }) as ImageUploadHandler
);

// Ruta para servir imágenes
router.get('/images/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../../public/images', filename);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ 
      message: 'Imagen no encontrada',
      filename: ''
    });
  }
});

export default router;