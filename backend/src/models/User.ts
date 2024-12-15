// backend/src/models/User.ts
import { Sequelize, DataTypes, Model } from 'sequelize';
import Role from './Role';

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public roleId!: number;
  public avatar?: string;
  public description?: string;
  public status?: string;
  public profileImage?: string;

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
          unique: true, // Importante para la validación en registro
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true, // Validación adicional para emails
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        roleId: {
          type: DataTypes.INTEGER,
          references: {
            model: Role, // Referencia al modelo Role
            key: 'id',
          },
          allowNull: false,
        },
        avatar: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: 'active', // Estado predeterminado
        },
        profileImage: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true, // Para manejar createdAt y updatedAt automáticamente
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Role, { foreignKey: 'roleId' }); // Relación con roles
    this.hasMany(models.UserPhrasePermission, { foreignKey: 'userId' }); // Relación con permisos
    this.hasMany(models.UserPhraseInteraction, { foreignKey: 'userId' }); // Relación con interacciones
  }

  // Métodos para validaciones adicionales
  public static async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.findOne({ where: { username } });
    return !user;
  }

  public static async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.findOne({ where: { email } });
    return !user;
  }
}

export default User;