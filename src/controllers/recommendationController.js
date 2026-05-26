const recommendationService = require('../services/recommendationService');

async function create(req, res) {
  const data = await recommendationService.create(req.validated.body, req.user);

  return res.status(201).json({
    success: true,
    data,
  });
}

async function list(req, res) {
  const recommendations = await recommendationService.list();

  return res.status(200).json({
    success: true,
    data: recommendations,
  });
}

async function listByUser(req, res) {
  const recommendations = await recommendationService.listByUser(
    req.user,
    req.validated.params.userId,
  );

  return res.status(200).json({
    success: true,
    data: recommendations,
  });
}

module.exports = {
  create,
  list,
  listByUser,
};

