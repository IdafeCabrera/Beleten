// backend/src/routes/editRequestRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import EditRequest from '../models/EditRequest';

const router = Router();

router.post('/:phraseId/request', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phraseId } = req.params;
    const userId = req.user?.id;

    const request = await EditRequest.create({ userId, phraseId });
    res.status(201).json({ message: 'Solicitud enviada', request });
  } catch (error) {
    console.error('Error al solicitar edición:', error);
    next(error);
  }
});

// Validar una solicitud de edición
router.put(
    '/:id/validate',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { status } = req.body; // "approved" o "rejected"
        const request = await EditRequest.findByPk(req.params.id);
  
        if (!request) {
          res.status(404).json({ message: 'Solicitud no encontrada' });
          return;
        }
  
        request.status = status;
        await request.save();
  
        res.json({ message: `Solicitud ${status}`, request });
      } catch (error) {
        console.error('Error al validar la solicitud:', error);
        next(error);
      }
    }
  );

export default router;
