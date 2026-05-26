'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('recommendations', 'provider', {
      type: Sequelize.STRING(40),
      allowNull: false,
      defaultValue: 'local-fallback',
      after: 'reason',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('recommendations', 'provider');
  },
};
