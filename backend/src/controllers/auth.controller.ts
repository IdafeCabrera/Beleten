// backend/src/controllers/auth.controller.ts
// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/User';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

class AuthController {
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password } = req.body;

      if (!username?.trim() || !email?.trim() || !password?.trim()) {
        res.status(400).json({
          message: 'Todos los campos son requeridos'
        });
        return;
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: username.toLowerCase() },
            { email: email.toLowerCase() }
          ]
        }
      });

      if (existingUser) {
        res.status(400).json({
          message: 'El usuario o email ya está registrado'
        });
        return;
      }

      const newUser = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
        roleId: 2,
        isActive: true
      });

      const token = jwt.sign(
        { userId: newUser.id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          roleId: newUser.roleId
        },
        token
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        message: 'Error al registrar usuario'
      });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader?.startsWith('Basic ')) {
        res.status(401).json({
          message: 'Autenticación requerida'
        });
        return;
      }

      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');

      const user = await User.findOne({
        where: { 
          username: username.toLowerCase(),
          isActive: true 
        }
      });

      if (!user) {
        res.status(401).json({
          message: 'Credenciales inválidas'
        });
        return;
      }

      const validPassword = await user.comparePassword(password);
      if (!validPassword) {
        res.status(401).json({
          message: 'Credenciales inválidas'
        });
        return;
      }

      const token = jwt.sign(
        { userId: user.id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      res.json({
        message: 'Login exitoso',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          roleId: user.roleId
        },
        token
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        message: 'Error en el login'
      });
    }
  };

  public verifyToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.userId) {
        res.status(401).json({
          message: 'Usuario no autenticado'
        });
        return;
      }

      const user = await User.findByPk(req.user.userId);
      if (!user) {
        res.status(404).json({
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.json({
        message: 'Token válido',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          roleId: user.roleId
        }
      });
    } catch (error) {
      console.error('Error en verificación:', error);
      res.status(500).json({
        message: 'Error en la verificación del token'
      });
    }
  };

  public changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          message: 'Usuario no autenticado'
        });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({
          message: 'Usuario no encontrado'
        });
        return;
      }

      const validPassword = await user.comparePassword(currentPassword);
      if (!validPassword) {
        res.status(401).json({
          message: 'Contraseña actual incorrecta'
        });
        return;
      }

      user.password = newPassword;
      await user.save();

      res.json({
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json({
        message: 'Error al cambiar la contraseña'
      });
    }
  };
}

export const authController = new AuthController();