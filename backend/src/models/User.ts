// backend/src/models/User.ts
// src/models/User.ts
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import Role from './Role';

// Interfaces
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  lastLogin?: Date;
  isActive: boolean;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Hacer opcionales los campos generados automáticamente para la creación
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'lastLogin' | 'refreshToken' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public roleId!: number;
  public lastLogin?: Date;
  public isActive!: boolean;
  public refreshToken?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para validar contraseña
  public async comparePassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }

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
          validate: {
            len: [3, 50],
            notEmpty: true,
            async isUnique(value: string) {
              const existingUser = await User.findOne({ 
                where: { username: value.toLowerCase() }
              });
              if (existingUser && existingUser.id !== this.id) {
                throw new Error('Username already exists');
              }
            }
          },
          set(value: string) {
            this.setDataValue('username', value.toLowerCase());
          }
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true,
            notEmpty: true,
            async isUnique(value: string) {
              const existingUser = await User.findOne({ 
                where: { email: value.toLowerCase() }
              });
              if (existingUser && existingUser.id !== this.id) {
                throw new Error('Email already exists');
              }
            }
          },
          set(value: string) {
            this.setDataValue('email', value.toLowerCase());
          }
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [6, 100],
            notEmpty: true
          }
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        refreshToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'users',
        indexes: [
          {
            unique: true,
            fields: ['username'],
            name: 'users_username_unique'
          },
          {
            unique: true,
            fields: ['email'],
            name: 'users_email_unique'
          },
          {
            fields: ['roleId'],
            name: 'users_roleId'
          }
        ],
        hooks: {
          // Hook para encriptar la contraseña antes de crear/actualizar
          beforeSave: async (user: User) => {
            if (user.changed('password')) {
              try {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
              } catch (error) {
                console.error('Error hashing password:', error);
                throw new Error('Error processing password');
              }
            }
          },
          // Normalizar email y username antes de validar
          beforeValidate: (user: User) => {
            if (user.email) {
              user.email = user.email.toLowerCase();
            }
            if (user.username) {
              user.username = user.username.toLowerCase();
            }
          }
        },
        defaultScope: {
          attributes: { exclude: ['password', 'refreshToken'] }
        },
        scopes: {
          withPassword: {
            attributes: { include: ['password'] }
          },
          active: {
            where: { isActive: true }
          }
        }
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Role, { 
      foreignKey: 'roleId',
      as: 'role'
    });
    this.hasMany(models.UserPhrasePermission, { 
      foreignKey: 'userId',
      as: 'permissions'
    });
    this.hasMany(models.UserPhraseInteraction, { 
      foreignKey: 'userId',
      as: 'interactions'
    });
  }

  // Método para generar token JWT
  public generateToken(): string {
    // Implementación en auth.service.ts
    return '';
  }

  // Método para generar refresh token
  public async generateRefreshToken(): Promise<string> {
    try {
      const refreshToken = Math.random().toString(36).substring(2) + 
                          Date.now().toString(36);
      this.refreshToken = refreshToken;
      await this.save();
      return refreshToken;
    } catch (error) {
      console.error('Error generating refresh token:', error);
      throw new Error('Error generating refresh token');
    }
  }

  // Método para actualizar último login
  public async updateLastLogin(): Promise<void> {
    try {
      this.lastLogin = new Date();
      await this.save();
    } catch (error) {
      console.error('Error updating last login:', error);
      throw new Error('Error updating last login');
    }
  }
}

export default User;