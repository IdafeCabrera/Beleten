// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import  User  from '../models/User';
import { generateToken } from '../utils/tokenUtils';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return;
    }

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'La contraseña actual es incorrecta' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;
    console.log('Datos recibidos en login:', { identifier, password });
    // Buscar usuario por nombre o correo
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });
    console.log('Usuario encontrado:', user);
    if (!user) {
      res.status(404).json({ message: 'Usuario o correo electrónico no encontrado' });
      return;
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    // Generar token JWT
    const token = generateToken(user.id);
    console.log('Token generado:', token);
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, roleId } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Todos los campos son obligatorios.' });
      return;
    }

    // Validar existencia de nombre de usuario y correo
    const existingUser = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
    if (existingUser) {
      const field = existingUser.username === username ? 'usuario' : 'correo electrónico';
      res.status(400).json({ message: `El ${field} ya está en uso` });
      return;
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId: roleId || 2, // Asignar rol predeterminado (user)
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};



export const checkUsernameAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ where: { username } });

    res.status(200).json({ available: !user });
  } catch (error) {
    console.error('Error al verificar nombre de usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

export const verify = (req: Request, res: Response): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: 'No se proporcionó un token' });
      return;
    }

    const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer"

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    res.status(200).json({
      message: 'Token válido',
      user: decoded,
    });
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(401).json({ message: 'Token inválido o expirado', error });
  }
};





