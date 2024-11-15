// backend/src/routes/phraseRoutes.ts
import { Router } from 'express';
import Phrase from '../models/Phrase';
import { GenericController } from '../controllers/GenericController';

const phraseController = new GenericController(Phrase);
const router = Router();

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

export default router;