/* eslint-disable no-console */
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('notes_app', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
