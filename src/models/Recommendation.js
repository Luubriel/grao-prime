const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Recommendation = sequelize.define(
    'Recommendation',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'user_id',
      },
      preferredIntensity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'preferred_intensity',
      },
      preferredAcidity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'preferred_acidity',
      },
      preferredBitterness: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'preferred_bitterness',
      },
      preferredSweetness: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'preferred_sweetness',
      },
      preferredRoastLevel: {
        type: DataTypes.ENUM('CLARA', 'MEDIA', 'ESCURA'),
        allowNull: false,
        field: 'preferred_roast_level',
      },
      preferredBrewingMethodId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'preferred_brewing_method_id',
      },
      recommendedCoffeeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'recommended_coffee_id',
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'recommendations',
    },
  );

  Recommendation.associate = (models) => {
    Recommendation.belongsTo(models.User, { foreignKey: 'userId' });
    Recommendation.belongsTo(models.Coffee, { foreignKey: 'recommendedCoffeeId' });
    Recommendation.belongsTo(models.BrewingMethod, {
      foreignKey: 'preferredBrewingMethodId',
      as: 'preferredBrewingMethod',
    });
  };

  return Recommendation;
};

