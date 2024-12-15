// backend/src/utils/tokenUtils.ts
import jwt from 'jsonwebtoken';

export const generateToken = (userId: number): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
