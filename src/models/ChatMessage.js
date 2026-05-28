const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChatMessage = sequelize.define(
    'ChatMessage',
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
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: 'local',
      },
    },
    {
      tableName: 'chat_messages',
    },
  );

  ChatMessage.associate = (models) => {
    ChatMessage.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return ChatMessage;
};

