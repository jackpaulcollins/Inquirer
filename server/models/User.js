import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../db.js';
import Document from './Document.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// eslint-disable-next-line func-names
User.prototype.checkPassword = async function (password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
};

User.hasMany(Document, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  // eslint-disable-next-line no-param-reassign
  user.password = await bcrypt.hash(user.password, salt);
});

User.addHook('afterValidate', (user) => {
  const errors = [];
  if (user.errors) {
    user.errors.forEach((error) => {
      errors.push(error.message);
    });
  }
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
});

export default User;
