// src/routes/auth.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Wrapper para manejar errores async
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Rutas públicas
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    await authController.register(req, res);
  })
);

router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    await authController.login(req, res);
  })
);

// Rutas protegidas
router.get(
  '/verify',
  authMiddleware as any, // Temporal fix para el error de tipos
  asyncHandler(async (req: Request, res: Response) => {
    await authController.verifyToken(req as any, res);
  })
);

router.post(
  '/change-password',
  authMiddleware as any, // Temporal fix para el error de tipos
  asyncHandler(async (req: Request, res: Response) => {
    await authController.changePassword(req as any, res);
  })
);

export default router;