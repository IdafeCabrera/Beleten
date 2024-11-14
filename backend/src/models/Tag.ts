// backend/src/models/Tag.ts
import { Sequelize, DataTypes, Model } from 'sequelize';
import { BaseModel } from './BaseModel';


class Tag extends BaseModel {
  public name!: string;

  static initialize(sequelize: Sequelize) {
    super.initialize(sequelize, 'tags');
    this.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Evitar etiquetas duplicadas
        set(value: string) {
          this.setDataValue('name', value.toLowerCase().trim());
        },
      },
    }, {
      sequelize,
      tableName: 'tags',
      timestamps: false,
    });
  }

  static associate(models: any) {
    this.belongsToMany(models.Phrase, { through: 'phrase_tags', foreignKey: 'tagId' });
  }
}

export default Tag;
