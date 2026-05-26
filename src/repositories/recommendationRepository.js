const { fn, col, literal } = require('sequelize');

const { Coffee, Recommendation, User } = require('../models');

const include = [
  {
    model: Coffee,
    attributes: ['id', 'name', 'roastLevel', 'intensity', 'price'],
  },
  {
    model: User,
    attributes: ['id', 'name', 'email', 'role'],
  },
];

async function bulkCreate(items) {
  return Recommendation.bulkCreate(items);
}

async function findAll() {
  return Recommendation.findAll({
    include,
    order: [['createdAt', 'DESC']],
  });
}

async function findByUserId(userId) {
  return Recommendation.findAll({
    where: { userId },
    include,
    order: [['createdAt', 'DESC']],
  });
}

async function countAll() {
  return Recommendation.count();
}

async function latest(limit = 5) {
  return Recommendation.findAll({
    include,
    order: [['createdAt', 'DESC']],
    limit,
  });
}

async function mostRecommended(limit = 5) {
  return Recommendation.findAll({
    attributes: [
      'recommendedCoffeeId',
      [fn('COUNT', col('Recommendation.id')), 'totalRecommendations'],
    ],
    include: [
      {
        model: Coffee,
        attributes: ['id', 'name', 'roastLevel', 'intensity'],
      },
    ],
    group: ['recommendedCoffeeId', 'Coffee.id'],
    order: [[literal('totalRecommendations'), 'DESC']],
    limit,
  });
}

module.exports = {
  bulkCreate,
  findAll,
  findByUserId,
  countAll,
  latest,
  mostRecommended,
};

