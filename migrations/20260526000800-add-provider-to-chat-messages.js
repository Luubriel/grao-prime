'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('chat_messages', 'provider', {
      type: Sequelize.STRING(40),
      allowNull: false,
      defaultValue: 'local',
      after: 'response',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('chat_messages', 'provider');
  },
};
