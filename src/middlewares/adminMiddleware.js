const AppError = require('../utils/AppError');

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError('Acesso restrito a administradores', 403));
  }

  return next();
}

module.exports = adminMiddleware;

