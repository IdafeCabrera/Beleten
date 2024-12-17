// backend/src/routes/authRoutes.ts
import { Router, Request, Response } from 'express';
import { register, login, checkUsernameAvailability, verify, changePassword } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { AuthRequest } from '../middleware/authMiddleware';


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-username', checkUsernameAvailability);
router.get('/verify', verify);
router.post('/change-password', authMiddleware, changePassword);

router.get('/user/details', authMiddleware, async (req, res): Promise<void> => {
    try {
      const user = (req as AuthRequest).user; // Asegúrate de castear a AuthRequest
      if (!user) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }
  
      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
      });
    } catch (error) {
      console.error('Error al obtener los detalles del usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
  

export default router;
