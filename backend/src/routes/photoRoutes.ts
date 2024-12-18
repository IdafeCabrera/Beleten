// backend/src/routes/photoRoutes.ts
// backend/src/routes/phtoRoutes.ts
import express from 'express';
import { deletePhoto } from '../controllers/photoController';

const router = express.Router();

// Ruta para eliminar fotos
router.delete('/:filename', deletePhoto);

export default router;
