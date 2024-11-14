// backend/src/models/User.ts
import { Sequelize, DataTypes, Model } from 'sequelize';
import Role from './Role';

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public roleId!: number;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        roleId: {
          type: DataTypes.INTEGER,
          references: {
            model: Role,  // Relación con el modelo Role
            key: 'id',
          },
          allowNull: false,
        },
      },
      {
        sequelize,  // Asegúrate de que la instancia de Sequelize es correcta
        tableName: 'users',
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Role, { foreignKey: 'roleId' });  // Un usuario pertenece a un rol
        this.hasMany(models.UserPhrasePermission, { foreignKey: 'userId' });  // Un usuario puede tener permisos en muchas frases
    this.hasMany(models.UserPhraseInteraction, { foreignKey: 'userId' });  // Un usuario puede tener muchas interacciones con frases

  }
  
}

export default User;
