// backend/src/routes/roleRoutes.ts
import { Router } from 'express';
import { getRoles, getRoleById, createRole, updateRole, deleteRole } from '../controllers/roleController';

const router = Router();

router.get('/', getRoles); // Obtener todos los roles
router.get('/:id', getRoleById); // Obtener un rol por ID
router.post('/', createRole); // Crear un nuevo rol
router.put('/:id', updateRole); // Actualizar un rol
router.delete('/:id', deleteRole); // Eliminar un rol

export default router;
