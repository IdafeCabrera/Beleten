// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    [key: string]: any;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token no proporcionado' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: number };
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en la autenticación' });
  }
};