import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Document from './Document.js';

const Vector = sequelize.define('vector', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  vectorData: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

Vector.belongsTo(Document, { foreignKey: 'document_id', onDelete: 'CASCADE' });

export default Vector;
