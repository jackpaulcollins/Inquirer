'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('users', {
      type: 'unique',
      fields: ['username'],
      name: 'unique_username'
    });
  }
};
