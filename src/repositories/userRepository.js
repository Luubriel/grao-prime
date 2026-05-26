const { User } = require('../models');

async function create(data) {
  return User.create(data);
}

async function findByEmail(email) {
  return User.findOne({ where: { email } });
}

async function findById(id) {
  return User.findByPk(id);
}

module.exports = {
  create,
  findByEmail,
  findById,
};

