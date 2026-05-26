const AppError = require('../utils/AppError');
const categoryRepository = require('../repositories/categoryRepository');
const coffeeRepository = require('../repositories/coffeeRepository');

async function list() {
  return categoryRepository.findAll();
}

async function getById(id) {
  const category = await categoryRepository.findById(id);

  if (!category) {
    throw new AppError('Categoria não encontrada', 404);
  }

  return category;
}

async function ensureNameAvailable(name, ignoredId = null) {
  const existingCategory = await categoryRepository.findByName(name);

  if (existingCategory && existingCategory.id !== ignoredId) {
    throw new AppError('Já existe uma categoria com este nome', 409);
  }
}

async function create(data) {
  await ensureNameAvailable(data.name);
  return categoryRepository.create(data);
}

async function update(id, data) {
  const category = await getById(id);
  await ensureNameAvailable(data.name, category.id);
  return categoryRepository.update(category, data);
}

async function remove(id) {
  const category = await getById(id);
  const coffeesCount = await coffeeRepository.countByCategoryId(id);

  if (coffeesCount > 0) {
    throw new AppError('Não é possível excluir categoria vinculada a cafés', 409);
  }

  await categoryRepository.remove(category);
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};

