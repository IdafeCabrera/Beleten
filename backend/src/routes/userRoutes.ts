// backend/src/routes/userRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import User from '../models/User';

const router = Router();

// Ruta para obtener los detalles del usuario autenticado
router.get('/details', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user; // Casting seguro

    if (!user) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    // Consultar más detalles del usuario si es necesario
    const userDetails = await User.findByPk(user.id, {
      attributes: ['id', 'username', 'email', 'roleId'],
    });

    if (!userDetails) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Respuesta exitosa con los detalles del usuario
    res.status(200).json({
      id: userDetails.id,
      username: userDetails.username,
      email: userDetails.email,
      roleId: userDetails.roleId,
    });
  } catch (error) {
    console.error('Error al obtener los detalles del usuario:', error);
    next(error); // Pasar el error al manejador de errores global
  }
});


// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, roleId, isActive } = req.body;
    const [updated] = await User.update({ username, email, roleId, isActive }, { where: { id } });

    if (updated) {
      const updatedUser = await User.findByPk(id);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});




export default router;
