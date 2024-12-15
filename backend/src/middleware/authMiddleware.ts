// backend/src/middleware/authMiddleware.ts
// backend/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User  from '../models/User';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Acceso no autorizado' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido', error });
  }
};
