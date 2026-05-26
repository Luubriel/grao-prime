const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const env = require('../config/env');
const AppError = require('../utils/AppError');
const userRepository = require('../repositories/userRepository');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  );
}

async function register({ name, email, password }) {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError('E-mail já cadastrado', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role: 'USER',
  });

  return user.toJSON();
}

async function login({ email, password }) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new AppError('Credenciais inválidas', 401);
  }

  return {
    user: user.toJSON(),
    token: generateToken(user),
  };
}

module.exports = {
  register,
  login,
};

