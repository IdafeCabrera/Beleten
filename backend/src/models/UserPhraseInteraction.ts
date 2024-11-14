// backend/src/models/UserPhraseInteraction.ts
import { Sequelize, DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';
import User from './User';
import Phrase from './Phrase';

class UserPhraseInteraction extends BaseModel {
  public userId!: number;
  public phraseId!: number;
  public isSeen!: boolean;
  public isFavorite!: boolean;
  public rating!: number | null;

  static initialize(sequelize: Sequelize) {
    // super.initialize(sequelize, 'user_phrase_interactions'); // Llamada a BaseModel para inicializar
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
        isSeen: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        isFavorite: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: 1,
            max: 5,
          },
        },
      },
      {
        sequelize,
        tableName: 'user_phrase_interactions',
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId' });  // Una interacción pertenece a un usuario
    this.belongsTo(models.Phrase, { foreignKey: 'phraseId' });  // Una interacción pertenece a una frase
  }
  
}

export default UserPhraseInteraction;
