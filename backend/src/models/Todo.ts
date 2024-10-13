// /backend/models/todo.ts
import { BaseModel } from './BaseModel';
import { Sequelize, DataTypes } from 'sequelize';

class Todo extends BaseModel {
  public title!: string;
  public completed!: boolean;
  public priority!: number;

  static initialize(sequelize: Sequelize) {
    super.initialize(sequelize, 'todos');
    this.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        completed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        priority: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'todos',
        timestamps: true,  // Esto asegura que Sequelize gestione createdAt y updatedAt
      }
    );
  }

  static associate(models: any) {
    // Si hay relaciones con otros modelos, se definen aquí.
    // Por ejemplo, si cada Todo pertenece a un usuario:
    // this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Todo;
