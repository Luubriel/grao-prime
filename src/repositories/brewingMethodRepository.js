const { BrewingMethod } = require('../models');

async function findAll() {
  return BrewingMethod.findAll({ order: [['name', 'ASC']] });
}

async function findById(id) {
  return BrewingMethod.findByPk(id);
}

async function findByName(name) {
  return BrewingMethod.findOne({ where: { name } });
}

async function create(data) {
  return BrewingMethod.create(data);
}

async function update(brewingMethod, data) {
  return brewingMethod.update(data);
}

async function remove(brewingMethod) {
  return brewingMethod.destroy();
}

module.exports = {
  findAll,
  findById,
  findByName,
  create,
  update,
  remove,
};

