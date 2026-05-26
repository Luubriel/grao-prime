const { Coffee } = require('../models');

async function countByCategoryId(categoryId) {
  return Coffee.count({ where: { categoryId } });
}

async function countByBrewingMethodId(brewingMethodId) {
  return Coffee.count({ where: { brewingMethodId } });
}

module.exports = {
  countByCategoryId,
  countByBrewingMethodId,
};

