// backend/src/routes/phraseRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import Phrase from '../models/Phrase';
import { GenericController } from '../controllers/GenericController';
import upload from '../multer/upload';

const phraseController = new GenericController(Phrase);
const router = Router();


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


// Ruta para subir imagen
router.post(
  '/:id/image',
  upload.single('file'),
  async (req: TypedRequestWithFile, res: Response, next: NextFunction) => {
    try {
      const phraseId = req.params.id;
      const phrase = await Phrase.findByPk(phraseId);

      if (!phrase) {
        res.status(404).json({ message: 'Frase no encontrada' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: 'No se ha proporcionado ninguna imagen' });
        return;
      }

      await phrase.update({
        filename: req.file.filename
      });

      res.status(200).json({
        message: 'Imagen subida correctamente',
        filename: req.file.filename
      });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      next(error);
    }
  }
);

export default router;