// backend/src/models/Phrase.ts
import { Sequelize, DataTypes} from 'sequelize';
import { BaseModel } from './BaseModel';
import Tag from './Tag';


class Phrase extends BaseModel {
  public filename!: string | null;

  addTag(tagRecord: Tag) {
    throw new Error('Method not implemented.');
  }
  public text!: string;
  public author!: string | null;
  public alias!: string | null;
  public category!: string | null;
  public date_of_birth!: Date | null;
  public date_of_death!: Date | null;
  public reflection!: string | null;
  public historical_context!: string | null;
  public career!: string | null;
  public author_image!: string | null;
  public default_background_image!: string | null;
  public custom_background_image!: string | null;
  public submitted_by!: string | null;
  public created_at!: Date | null;
  public last_edited_by!: string | null;
  public last_edited_at!: Date | null;
  public original_language!: string | null ;
  public is_verified!: boolean;
  public is_editable!: boolean;

  static initialize(sequelize: Sequelize) {
    super.initialize(sequelize, 'phrases');
    this.init({
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Esto evitará frases duplicadas
      },
      author: { type: DataTypes.STRING, allowNull: true },
      alias: { type: DataTypes.STRING, allowNull: true },
      category: { type: DataTypes.STRING, allowNull: true },
      date_of_birth: { type: DataTypes.DATE, allowNull: true },
      date_of_death: { type: DataTypes.DATE, allowNull: true },
      reflection: { type: DataTypes.TEXT, allowNull: true },
      historical_context: { type: DataTypes.TEXT, allowNull: true },
      career: { type: DataTypes.STRING, allowNull: true },
      author_image: { type: DataTypes.STRING, allowNull: true },
      default_background_image: { type: DataTypes.STRING, allowNull: true },
      custom_background_image: { type: DataTypes.STRING, allowNull: true },
      submitted_by: { type: DataTypes.STRING, allowNull: true },
      original_language: { type: DataTypes.STRING, allowNull: true },
      is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_editable: { type: DataTypes.BOOLEAN, defaultValue: true },
      filename: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Ruta del archivo de imagen asociado a la frase'
      }
    }, {
      sequelize,
      tableName: 'phrases',
      timestamps: true,  // createdAt y updatedAt
    });
  }

   static associate(models: any) {
    this.belongsToMany(models.Tag, {
       through: 'phrase_tags', 
       foreignKey: 'phraseId' });
    
  }
}

/* static associate(models: any) {
    this.belongsToMany(models.User, {
      through: 'user_phrase_interactions',
      foreignKey: 'phraseId',
      as: 'users'
    });
    this.belongsToMany(models.Tag, { 
      through: 'phrase_tags', 
      foreignKey: 'phraseId' 
    });
  }
}  */

export default Phrase;
