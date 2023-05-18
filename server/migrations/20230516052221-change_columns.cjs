/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('queryables', 'reference_id');
    await queryInterface.removeColumn('queryables', 'referenced_queryable_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('queryables', 'reference_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'queryables',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
      constraints: false,
      validate: {
        customValidation(value) {
          if (value !== null && this.queryable_type !== 'question') {
            throw new Error('The referenced queryable must have queryable_type of "question".');
          }
        },
      },
    });
  },
};
