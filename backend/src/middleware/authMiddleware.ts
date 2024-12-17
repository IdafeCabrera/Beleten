// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Tipo simplificado para el usuario autenticado
interface UserPayload {
  id: number;
  username: string;
  email: string;
  roleId: number;
}

// Interfaz local solo para este middleware
export interface AuthRequest extends Omit<Request, 'user'> {
  user?: UserPayload; // Reemplaza la propiedad 'user' solo aquí
}

export const authMiddleware = async (
  req: AuthRequest, // Uso del tipo extendido aquí
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Acceso no autorizado: Token no proporcionado' });
      return;
    }

    // Decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

    // Buscar usuario con solo los atributos necesarios
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email', 'roleId'],
      raw: true, // Devuelve un objeto plano, no una instancia de Sequelize
    });

    if (!user) {
      res.status(401).json({ message: 'Acceso no autorizado: Usuario no encontrado' });
      return;
    }


    // Asignar el usuario simplificado a `req.user`
    req.user = user; // Asignar el usuario a req.user

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ message: 'Token inválido o expirado', error });
  }
};
