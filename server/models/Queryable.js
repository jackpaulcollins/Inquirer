import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

export const Queryable = sequelize.define('Queryable', {
  queryable_type: DataTypes.STRING,
  content: DataTypes.TEXT,
  user_id: DataTypes.INTEGER,
  document_id: DataTypes.INTEGER,
});

export default Queryable;
