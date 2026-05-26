'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recommendations', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      preferred_intensity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      preferred_acidity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      preferred_bitterness: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      preferred_sweetness: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      preferred_roast_level: {
        type: Sequelize.ENUM('CLARA', 'MEDIA', 'ESCURA'),
        allowNull: false,
      },
      preferred_brewing_method_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'brewing_methods',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      recommended_coffee_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'coffees',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('recommendations');
  },
};

