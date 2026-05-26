const categoryService = require('../services/categoryService');

async function list(req, res) {
  const categories = await categoryService.list();

  return res.status(200).json({
    success: true,
    data: categories,
  });
}

async function getById(req, res) {
  const category = await categoryService.getById(req.validated.params.id);

  return res.status(200).json({
    success: true,
    data: category,
  });
}

async function create(req, res) {
  const category = await categoryService.create(req.validated.body);

  return res.status(201).json({
    success: true,
    data: category,
  });
}

async function update(req, res) {
  const category = await categoryService.update(req.validated.params.id, req.validated.body);

  return res.status(200).json({
    success: true,
    data: category,
  });
}

async function remove(req, res) {
  await categoryService.remove(req.validated.params.id);

  return res.status(204).send();
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};

