const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const BrewingMethod = require('./BrewingMethod');
const Coffee = require('./Coffee');
const Recommendation = require('./Recommendation');
const ChatMessage = require('./ChatMessage');

const models = {
  User: User(sequelize),
  Category: Category(sequelize),
  BrewingMethod: BrewingMethod(sequelize),
  Coffee: Coffee(sequelize),
  Recommendation: Recommendation(sequelize),
  ChatMessage: ChatMessage(sequelize),
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

const db = {
  sequelize,
  ...models,
};

module.exports = db;
