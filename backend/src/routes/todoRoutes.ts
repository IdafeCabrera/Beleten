// /backend/routes/todoRoutes.ts
import { Router } from 'express';
import Todo from '../models/Todo';
import { GenericController } from '../controllers/GenericController';

const todoController = new GenericController(Todo);
const router = Router();

router.get('/todos', (req, res) => todoController.getAll(req, res));
router.post('/todos', (req, res) => todoController.create(req, res));
router.put('/todos/:id', (req, res) => todoController.update(req, res));
router.delete('/todos/:id', (req, res) => todoController.delete(req, res));
router.put('/todos/:id/favorite', (req, res) => todoController.toggleFavorite(req, res));
router.get('/todos/search', (req, res) => todoController.searchByTag(req, res));

export default router;


