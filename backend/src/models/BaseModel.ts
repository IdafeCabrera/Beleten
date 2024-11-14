// backend/src/models/BaseModel.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export class BaseModel extends Model {
  public id!: number;
  public favorite!: boolean;
  public tags!: string[];
  
  static initialize(sequelize: Sequelize, tableName: string) {
    this.init(
      {
        favorite: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        tags: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName,
        timestamps: true,
      }
    );
  }
}
