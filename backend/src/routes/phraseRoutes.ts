// backend/src/routes/phraseRoutes.ts
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import Phrase from '../models/Phrase';
import { GenericController } from '../controllers/GenericController';
import upload from '../multer/upload';
import path from 'path';
import fs from 'fs';
import { deletePhoto } from '../controllers/photoController';


interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

interface ImageUploadResponse {
  message: string;
  filename: string;
}

// Manejador para imágenes
const serveImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../../public/images', filename);
    
    if (!fs.existsSync(imagePath)) {
      res.status(404).json({ 
        message: 'Imagen no encontrada',
        filename: ''
      });
      return;
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.sendFile(imagePath);
  } catch (error) {
    next(error);
  }
};


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
// IMPORTANTE: La ruta de búsqueda debe ir ANTES de las rutas con parámetros
// para evitar que Express la confunda con una ruta dinámica
router.get('/search', (req, res) => phraseController.search(req, res));

// Rutas genéricas
router.get('/', (req, res) => phraseController.getAll(req, res));
router.post('/', (req, res) => phraseController.create(req, res));
router.put('/:id', (req, res) => phraseController.update(req, res));
router.delete('/:id', (req, res) => phraseController.delete(req, res));
router.put('/:id/favorite', (req, res) => phraseController.toggleFavorite(req, res));

router.delete('/:filename', deletePhoto);




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
        return res.status(404).json({ 
          message: 'Frase no encontrada',
          filename: ''
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          message: 'No se ha proporcionado ninguna imagen',
          filename: ''
        });
      }

      const imageUrl = `/images/${req.file.filename}`;

      // Limpiar imagen anterior
      if (phrase.filename) {
        const oldImagePath = path.join(__dirname, '../../public', phrase.filename);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      await phrase.update({ filename: imageUrl });

      // Establecer headers para evitar problemas de caché
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      
      return res.json({
        message: 'Imagen subida correctamente',
        filename: imageUrl
      });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      return next(error);
    }
  }) as ImageUploadHandler
);

router.get('/images/:filename', serveImage);

export default router;