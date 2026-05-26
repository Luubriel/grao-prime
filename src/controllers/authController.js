const authService = require('../services/authService');

async function register(req, res) {
  const user = await authService.register(req.validated.body);

  return res.status(201).json({
    success: true,
    data: user,
  });
}

async function login(req, res) {
  const data = await authService.login(req.validated.body);

  return res.status(200).json({
    success: true,
    data,
  });
}

module.exports = {
  register,
  login,
};

