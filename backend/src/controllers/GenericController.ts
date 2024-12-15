// backend/src/controllers/GenericController.ts
import { Request, Response } from 'express';
import { col, fn, Model, Op, where } from 'sequelize';
import sequelize from '../config/config';
import { escape } from 'mysql2';


// Definir la interfaz antes de la clase
export interface VisualUpdate {
  backgroundColor?: string;
  fontColor?: string;
  fontFamily?: string;
  backgroundImage?: string;
  backgroundImageSource?: string;
  customFontSize?: string;
}

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


  public search = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q: query, type, page = '1', limit = '25' } = req.query;
      
      // Validaciones de seguridad
      if (!query || typeof query !== 'string') {
        res.status(400).json({ message: 'Se requiere un término de búsqueda válido' });
        return;
      }

      // Sanitizar entrada
      const sanitizedQuery = escape(query).replace(/^'|'$/g, '');
      const offset = Math.max(0, (Number(page) - 1) * Number(limit));
      const safeLimit = Math.min(Number(limit), 100); // Limitar cantidad máxima

      let whereClause: any = {};
      
      if (type) {
        switch (type) {
          case 'text':
            whereClause = where(
              fn('LOWER', col('text')),
              'LIKE',
              `%${sanitizedQuery.toLowerCase()}%`
            );
            break;
          case 'author':
            whereClause = where(
              fn('LOWER', col('author')),
              'LIKE',
              `%${sanitizedQuery.toLowerCase()}%`
            );
            break;
          case 'category':
            whereClause = where(
              fn('LOWER', col('category')),
              'LIKE',
              `%${sanitizedQuery.toLowerCase()}%`
            );
            break;
          case 'tag':
            whereClause = {
              'tags.es': {
                [Op.like]: `%${sanitizedQuery}%`
              }
            };
            break;
          default:
            res.status(400).json({ message: 'Tipo de búsqueda no válido' });
            return;
        }
      }

      const { count, rows } = await this.model.findAndCountAll({
        where: whereClause,
        limit: safeLimit,
        offset,
        order: [['id', 'DESC']],
        raw: true // Por seguridad
      });

      const totalPages = Math.ceil(count / safeLimit);

      res.json({
        phrases: rows,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems: count,
          itemsPerPage: safeLimit,
          hasMore: Number(page) < totalPages
        }
      });
    } catch (error: any) {
      console.error('Error en búsqueda:', error);
      res.status(500).json({ 
        message: 'Error al realizar la búsqueda', 
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };
  // Actualizar solo la apariencia visual de un registro
 // Actualizar solo la apariencia visual de un registro
 public updateVisual = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const visualData: VisualUpdate = {
      backgroundColor: req.body.backgroundColor,
      fontColor: req.body.fontColor,
      fontFamily: req.body.fontFamily,
      backgroundImage: req.body.backgroundImage,
      backgroundImageSource: req.body.backgroundImageSource,
      customFontSize: req.body.customFontSize
    };

    const item = await this.model.findByPk(id);
    if (!item) {
      res.status(404).json({ message: 'Registro no encontrado' });
      return;
    }

    await item.update(visualData);
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al actualizar la apariencia visual', error: error.message });
  }
};


  
 // Buscar por etiqueta
 public searchByTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tag } = req.query;
    if (typeof this.model.searchByTag !== 'function') {
      throw new Error('El modelo no soporta la búsqueda por etiqueta');
    }
    
    const items = await this.model.searchByTag(tag as string);
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al buscar por etiqueta', error: error.message });
  }
};
}