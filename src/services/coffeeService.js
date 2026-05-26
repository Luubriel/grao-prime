const AppError = require('../utils/AppError');
const { buildPagination } = require('../utils/pagination');
const brewingMethodRepository = require('../repositories/brewingMethodRepository');
const categoryRepository = require('../repositories/categoryRepository');
const coffeeRepository = require('../repositories/coffeeRepository');

async function ensureRelationsExist({ categoryId, brewingMethodId }) {
  const [category, brewingMethod] = await Promise.all([
    categoryId ? categoryRepository.findById(categoryId) : Promise.resolve(true),
    brewingMethodId ? brewingMethodRepository.findById(brewingMethodId) : Promise.resolve(true),
  ]);

  if (!category) {
    throw new AppError('Categoria não encontrada', 404);
  }

  if (!brewingMethod) {
    throw new AppError('Método de preparo não encontrado', 404);
  }
}

function ensureRange(min, max, message) {
  if (min !== undefined && max !== undefined && min > max) {
    throw new AppError(message, 400);
  }
}

async function list(filters) {
  ensureRange(filters.minPrice, filters.maxPrice, 'Preço mínimo não pode ser maior que o máximo');
  ensureRange(
    filters.minIntensity,
    filters.maxIntensity,
    'Intensidade mínima não pode ser maior que a máxima',
  );

  const { rows, count } = await coffeeRepository.findCatalog(filters);

  return {
    data: rows,
    pagination: buildPagination({
      page: filters.page,
      limit: filters.limit,
      total: count,
    }),
  };
}

async function getById(id) {
  const coffee = await coffeeRepository.findPublicById(id);

  if (!coffee) {
    throw new AppError('Café não encontrado', 404);
  }

  return coffee;
}

async function create(data) {
  await ensureRelationsExist(data);
  return coffeeRepository.create(data);
}

async function update(id, data) {
  const coffee = await coffeeRepository.findById(id);

  if (!coffee) {
    throw new AppError('Café não encontrado', 404);
  }

  await ensureRelationsExist(data);
  return coffeeRepository.update(coffee, data);
}

async function remove(id) {
  const coffee = await coffeeRepository.findById(id);

  if (!coffee) {
    throw new AppError('Café não encontrado', 404);
  }

  await coffeeRepository.softDelete(coffee);
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
