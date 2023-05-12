/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Documents', 'document_type', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
