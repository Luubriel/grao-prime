const jwt = require('jsonwebtoken');

const env = require('../config/env');
const AppError = require('../utils/AppError');
const userRepository = require('../repositories/userRepository');

async function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AppError('Token não informado', 401);
    }

    const token = authorization.replace('Bearer ', '').trim();
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await userRepository.findById(payload.id);

    if (!user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    req.user = user.toJSON();
    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError('Token inválido ou expirado', 401));
  }
}

module.exports = authMiddleware;

