const { ChatMessage, User } = require('../models');

async function create(data) {
  return ChatMessage.create(data);
}

async function findAll() {
  return ChatMessage.findAll({
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'email'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
}

module.exports = {
  create,
  findAll,
};

