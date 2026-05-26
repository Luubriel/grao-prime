const jwt = require('jsonwebtoken');

const env = require('../config/env');
const userRepository = require('../repositories/userRepository');

async function optionalAuthMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next();
    }

    const token = authorization.replace('Bearer ', '').trim();
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await userRepository.findById(payload.id);

    if (user) {
      req.user = user.toJSON();
    }

    return next();
  } catch (error) {
    return next();
  }
}

module.exports = optionalAuthMiddleware;

