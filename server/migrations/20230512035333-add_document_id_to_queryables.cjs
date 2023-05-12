/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Queryables', 'document_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
