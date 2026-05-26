const AppError = require('../utils/AppError');
const brewingMethodRepository = require('../repositories/brewingMethodRepository');
const coffeeRepository = require('../repositories/coffeeRepository');

async function list() {
  return brewingMethodRepository.findAll();
}

async function getById(id) {
  const brewingMethod = await brewingMethodRepository.findById(id);

  if (!brewingMethod) {
    throw new AppError('Método de preparo não encontrado', 404);
  }

  return brewingMethod;
}

async function ensureNameAvailable(name, ignoredId = null) {
  const existingBrewingMethod = await brewingMethodRepository.findByName(name);

  if (existingBrewingMethod && existingBrewingMethod.id !== ignoredId) {
    throw new AppError('Já existe um método de preparo com este nome', 409);
  }
}

async function create(data) {
  await ensureNameAvailable(data.name);
  return brewingMethodRepository.create(data);
}

async function update(id, data) {
  const brewingMethod = await getById(id);
  await ensureNameAvailable(data.name, brewingMethod.id);
  return brewingMethodRepository.update(brewingMethod, data);
}

async function remove(id) {
  const brewingMethod = await getById(id);
  const coffeesCount = await coffeeRepository.countByBrewingMethodId(id);

  if (coffeesCount > 0) {
    throw new AppError('Não é possível excluir método vinculado a cafés', 409);
  }

  await brewingMethodRepository.remove(brewingMethod);
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};

