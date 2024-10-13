import { Sequelize, DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

class Frase extends BaseModel {
  public text!: string;
  public author!: string;
  public tags!: string[];

  static initialize(sequelize: Sequelize) {
    super.initialize(sequelize, 'frases');
    this.init(
      {
        text: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        author: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        tags: {
          type: DataTypes.JSON,  // JSON para almacenar las etiquetas en MySQL
          allowNull: true,
        }
      },
      {
        sequelize,
        tableName: 'frases',
      }
    );
  }
}

export default Frase;
