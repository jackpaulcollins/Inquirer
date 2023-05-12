'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('queryables', {
      type: 'check',
      fields: ['queryable_type'],
      where: {
        queryable_type: ['answer', 'question'],
      },
    });
  },
};
