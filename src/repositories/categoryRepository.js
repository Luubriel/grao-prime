const { Category } = require('../models');

async function findAll() {
  return Category.findAll({ order: [['name', 'ASC']] });
}

async function findById(id) {
  return Category.findByPk(id);
}

async function findByName(name) {
  return Category.findOne({ where: { name } });
}

async function create(data) {
  return Category.create(data);
}

async function update(category, data) {
  return category.update(data);
}

async function remove(category) {
  return category.destroy();
}

module.exports = {
  findAll,
  findById,
  findByName,
  create,
  update,
  remove,
};

