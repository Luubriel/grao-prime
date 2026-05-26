const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BrewingMethod = sequelize.define(
    'BrewingMethod',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'brewing_methods',
    },
  );

  BrewingMethod.associate = (models) => {
    BrewingMethod.hasMany(models.Coffee, { foreignKey: 'brewingMethodId' });
    BrewingMethod.hasMany(models.Recommendation, {
      foreignKey: 'preferredBrewingMethodId',
      as: 'preferenceRecommendations',
    });
  };

  return BrewingMethod;
};

