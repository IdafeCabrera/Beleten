// backend/src/models/UserPhrasePermission.ts
import { Sequelize, DataTypes, Model } from 'sequelize';
import { BaseModel } from './BaseModel';
import User from './User';
import Phrase from './Phrase';

class UserPhrasePermission extends BaseModel {
  public userId!: number;
  public phraseId!: number;
  public canEdit!: boolean; // true si el usuario tiene permiso para editar la frase

  static initialize(sequelize: Sequelize) {
    super.initialize(sequelize, 'user_phrase_permission');
    this.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: 'id',
          },
          allowNull: false,
        },
        phraseId: {
          type: DataTypes.INTEGER,
          references: {
            model: Phrase,
            key: 'id',
          },
          allowNull: false,
        },
        canEdit: {
          type: DataTypes.BOOLEAN,
          defaultValue: false, // por defecto, los usuarios no pueden editar
        },
      },
      {
        sequelize,
        tableName: 'user_phrase_permissions',
      }
    );
  }

static associate(models: any) {
  this.belongsTo(models.User, { foreignKey: 'userId' });  // Un permiso pertenece a un usuario
  this.belongsTo(models.Phrase, { foreignKey: 'phraseId' });  // Un permiso pertenece a una frase
}

}

export default UserPhrasePermission;
