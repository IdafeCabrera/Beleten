// backend/src/controllers/roleController.ts
import { Request, Response, NextFunction } from 'express';
import Role from '../models/Role';

// Obtener todos los roles
export const getRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

// Obtener un rol por ID
export const getRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo rol
export const createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { roleName, description } = req.body;
    const newRole = await Role.create({ roleName, description });
    res.status(201).json(newRole);
  } catch (error) {
    next(error);
  }
};

// Actualizar un rol
export const updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { roleName, description } = req.body;
    const role = await Role.findByPk(id);

    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    role.roleName = roleName || role.roleName;
    role.description = description || role.description;
    await role.save();

    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

// Eliminar un rol
export const deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    await role.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
