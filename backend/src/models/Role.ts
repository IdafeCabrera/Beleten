// backend/src/models/Role.ts
import { Sequelize, DataTypes, Model } from 'sequelize';

class Role extends Model {
  public id!: number;
  public roleName!: string;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        roleName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'roles',
      }
    );
  }

  static associate(models: any) {
    this.hasMany(models.User, { foreignKey: 'roleId' });  // Un rol puede tener muchos usuarios
  }
  
}

export default Role;
