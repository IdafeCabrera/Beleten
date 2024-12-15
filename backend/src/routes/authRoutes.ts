// backend/src/routes/authRoutes.ts
// backend/routes/authRoutes.ts
import { Router } from 'express';
import { register, login, checkUsernameAvailability, verify } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-username', checkUsernameAvailability);
router.get('/verify', verify);

export default router;
