import { Request, Response } from 'express';
import { Model } from 'sequelize';

export class GenericController<T extends Model> {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }

  // Obtener todos los registros
  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const items = await this.model.findAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los datos', error });
    }
  };

  // Crear un nuevo registro
  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newItem = await this.model.create(req.body);
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el registro', error });
    }
  };

  // Actualizar un registro existente
  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const item = await this.model.findByPk(id);
      if (item) {
        await item.update(req.body);
        res.json(item);
      } else {
        res.status(404).json({ message: 'Registro no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el registro', error });
    }
  };

  // Eliminar un registro
  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const item = await this.model.findByPk(id);
      if (item) {
        await item.destroy();
        res.json({ message: 'Registro eliminado correctamente' });
      } else {
        res.status(404).json({ message: 'Registro no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el registro', error });
    }
  };

  // Alternar el estado de favorito
  public toggleFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const item = await this.model.findByPk(id);
      if (item) {
        await item.toggleFavorite();
        res.json(item);
      } else {
        res.status(404).json({ message: 'Registro no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al alternar el estado de favorito', error });
    }
  };

  // Buscar por etiqueta
  public searchByTag = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tag } = req.query;
      const items = await this.model.searchByTag(tag as string);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar por etiqueta', error });
    }
  };
}
