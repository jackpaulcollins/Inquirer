import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import { Feedback } from './Feedback.js';

export const Queryable = sequelize.define('Queryable', {
  queryable_type: DataTypes.STRING,
  content: DataTypes.TEXT,
  user_id: DataTypes.INTEGER,
  document_id: DataTypes.INTEGER,
  reference_id: DataTypes.INTEGER,
});

Queryable.hasMany(Feedback, { foreignKey: 'answer_id' });
Queryable.hasMany(Queryable, { foreignKey: 'reference_id', as: 'answer', onDelete: 'CASCADE' });

sequelize.sync();

export default Queryable;
