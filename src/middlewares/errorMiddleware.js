const AppError = require('../utils/AppError');
const env = require('../config/env');

function notFoundMiddleware(req, res, next) {
  next(new AppError('Rota não encontrada', 404));
}

function errorMiddleware(error, req, res, next) {
  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : 500;
  const response = {
    success: false,
    message: isAppError ? error.message : 'Erro interno do servidor',
    errors: isAppError ? error.errors : [],
  };

  if (env.nodeEnv !== 'production' && !isAppError) {
    response.errors = [error.message];
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  notFoundMiddleware,
  errorMiddleware,
};

