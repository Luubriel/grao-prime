const brewingMethodService = require('../services/brewingMethodService');

async function list(req, res) {
  const brewingMethods = await brewingMethodService.list();

  return res.status(200).json({
    success: true,
    data: brewingMethods,
  });
}

async function getById(req, res) {
  const brewingMethod = await brewingMethodService.getById(req.validated.params.id);

  return res.status(200).json({
    success: true,
    data: brewingMethod,
  });
}

async function create(req, res) {
  const brewingMethod = await brewingMethodService.create(req.validated.body);

  return res.status(201).json({
    success: true,
    data: brewingMethod,
  });
}

async function update(req, res) {
  const brewingMethod = await brewingMethodService.update(
    req.validated.params.id,
    req.validated.body,
  );

  return res.status(200).json({
    success: true,
    data: brewingMethod,
  });
}

async function remove(req, res) {
  await brewingMethodService.remove(req.validated.params.id);

  return res.status(204).send();
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};

