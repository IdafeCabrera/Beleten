// backend/src/models/PhraseTags.ts
import { Sequelize, DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

class PhraseTag extends BaseModel {
  static initialize(sequelize: Sequelize) {
    super.initialize(sequelize, 'phrase_tags');
    this.init({
      phraseId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'phrases',
          key: 'id',
        },
      },
      tagId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'tags',
          key: 'id',
        },
      },
    }, {
      sequelize,
      tableName: 'phrase_tags',
      timestamps: false,
    });
  }
}

export default PhraseTag;
