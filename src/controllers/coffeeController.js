const coffeeService = require('../services/coffeeService');

async function list(req, res) {
  const result = await coffeeService.list(req.validated.query);

  return res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
}

async function getById(req, res) {
  const coffee = await coffeeService.getById(req.validated.params.id);

  return res.status(200).json({
    success: true,
    data: coffee,
  });
}

async function create(req, res) {
  const coffee = await coffeeService.create(req.validated.body);

  return res.status(201).json({
    success: true,
    data: coffee,
  });
}

async function update(req, res) {
  const coffee = await coffeeService.update(req.validated.params.id, req.validated.body);

  return res.status(200).json({
    success: true,
    data: coffee,
  });
}

async function remove(req, res) {
  await coffeeService.remove(req.validated.params.id);

  return res.status(204).send();
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};

