const { Op } = require('sequelize');

const { BrewingMethod, Category, Coffee } = require('../models');
const { getOffset } = require('../utils/pagination');

const include = [
  {
    model: Category,
    attributes: ['id', 'name', 'description'],
  },
  {
    model: BrewingMethod,
    attributes: ['id', 'name', 'description'],
  },
];

function buildCatalogWhere(filters) {
  const where = {
    active: true,
  };

  if (filters.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${filters.search}%` } },
      { description: { [Op.like]: `%${filters.search}%` } },
    ];
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.brewingMethodId) {
    where.brewingMethodId = filters.brewingMethodId;
  }

  if (filters.roastLevel) {
    where.roastLevel = filters.roastLevel;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price[Op.gte] = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price[Op.lte] = filters.maxPrice;
  }

  if (filters.minIntensity !== undefined || filters.maxIntensity !== undefined) {
    where.intensity = {};
    if (filters.minIntensity !== undefined) where.intensity[Op.gte] = filters.minIntensity;
    if (filters.maxIntensity !== undefined) where.intensity[Op.lte] = filters.maxIntensity;
  }

  return where;
}

async function findCatalog(filters) {
  const { page, limit, orderBy, orderDirection } = filters;

  return Coffee.findAndCountAll({
    where: buildCatalogWhere(filters),
    include,
    order: [[orderBy, orderDirection]],
    limit,
    offset: getOffset(page, limit),
    distinct: true,
  });
}

async function findPublicById(id) {
  return Coffee.findOne({
    where: {
      id,
      active: true,
    },
    include,
  });
}

async function findById(id) {
  return Coffee.findByPk(id, { include });
}

async function create(data) {
  return Coffee.create(data);
}

async function update(coffee, data) {
  return coffee.update(data);
}

async function softDelete(coffee) {
  return coffee.update({ active: false });
}

async function countByCategoryId(categoryId) {
  return Coffee.count({ where: { categoryId } });
}

async function countByBrewingMethodId(brewingMethodId) {
  return Coffee.count({ where: { brewingMethodId } });
}

module.exports = {
  findCatalog,
  findPublicById,
  findById,
  create,
  update,
  softDelete,
  countByCategoryId,
  countByBrewingMethodId,
};
