const { ChatMessage, User } = require('../models');
const { getOffset } = require('../utils/pagination');

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

async function findAllPaginated({ page, limit, provider }) {
  const where = {};

  if (provider) {
    where.provider = provider;
  }

  return ChatMessage.findAndCountAll({
    where,
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'email'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset: getOffset(page, limit),
  });
}

async function findByUserPaginated(userId, page, limit) {
  return ChatMessage.findAndCountAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit,
    offset: getOffset(page, limit),
  });
}

async function findRecentByUserId(userId, limit = 6) {
  const messages = await ChatMessage.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit,
  });

  return messages.reverse();
}

module.exports = {
  create,
  findAll,
  findAllPaginated,
  findByUserPaginated,
  findRecentByUserId,
};

