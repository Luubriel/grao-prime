const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Coffee = sequelize.define(
    'Coffee',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(160),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'category_id',
      },
      brewingMethodId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'brewing_method_id',
      },
      roastLevel: {
        type: DataTypes.ENUM('CLARA', 'MEDIA', 'ESCURA'),
        allowNull: false,
        field: 'roast_level',
      },
      intensity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      acidity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      bitterness: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      sweetness: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'image_url',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'coffees',
    },
  );

  Coffee.associate = (models) => {
    Coffee.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Coffee.belongsTo(models.BrewingMethod, { foreignKey: 'brewingMethodId' });
    Coffee.hasMany(models.Recommendation, { foreignKey: 'recommendedCoffeeId' });
  };

  return Coffee;
};

