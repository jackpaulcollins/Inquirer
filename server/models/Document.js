import { DataTypes } from 'sequelize';
import { Queryable } from './Queryable.js';
import sequelize from '../db.js';

const Document = sequelize.define('Document', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  document_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Document.hasMany(Queryable, { foreignKey: 'document_id', onDelete: 'CASCADE' });

export default Document;
