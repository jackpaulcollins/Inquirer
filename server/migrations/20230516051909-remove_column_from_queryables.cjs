/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn('queryables', 'referenced_queryable_id');
  }
};
