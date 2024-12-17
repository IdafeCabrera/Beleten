// backend/src/models/EditRequest.ts
import { Sequelize, DataTypes, Model } from 'sequelize';
import User from './User';
import Phrase from './Phrase';

class EditRequest extends Model {
  public id!: number;
  public userId!: number;
  public phraseId!: number;
  public status!: 'pending' | 'approved' | 'rejected';
}

export const initializeEditRequest = (sequelize: Sequelize) => {
  EditRequest.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: User, key: 'id' },
    },
    phraseId: {
      type: DataTypes.INTEGER,
      references: { model: Phrase, key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    tableName: 'edit_requests',
  });
};

export default EditRequest;
