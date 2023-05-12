import { DataTypes } from 'sequelize';
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

Document.associate = (models) => {
  Document.belongsTo(models.User, {
    name: 'user_id',
    allowNull: false,
  });
};

export default Document;
