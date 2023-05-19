/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE queryables DROP FOREIGN KEY queryables_reference_id_foreign_idx;');
    await queryInterface.sequelize.query('ALTER TABLE queryables ADD FOREIGN KEY (reference_id) REFERENCES queryables(id) ON DELETE CASCADE;');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE queryables DROP FOREIGN KEY queryables_reference_id_foreign_idx;');
    await queryInterface.sequelize.query('ALTER TABLE queryables ADD FOREIGN KEY (reference_id) REFERENCES queryables(id) ON DELETE RESTRICT;');
  }
};
