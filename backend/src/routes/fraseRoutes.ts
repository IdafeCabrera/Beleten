import { Router } from 'express';
import Frase from '../models/Frase';
import { GenericController } from '../controllers/GenericController';

const fraseController = new GenericController(Frase);
const router = Router();

router.get('/', fraseController.getAll);
router.post('/', fraseController.create);
router.put('/:id', fraseController.update);
router.delete('/:id', fraseController.delete);
router.put('/:id/favorite', fraseController.toggleFavorite);

// Ruta para la inserción masiva
router.post('/bulk', async (req, res) => {
  try {
    const frases = req.body; // Los datos que llegan en el body
    const createdFrases = await Frase.bulkCreate(frases, { validate: true });
    res.status(201).json(createdFrases);
  } catch (error) {
    res.status(500).json({ message: 'Error al insertar frases', error });
  }
});

export default router;
