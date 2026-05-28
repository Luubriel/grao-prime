const chatMessageRepository = require('../repositories/chatMessageRepository');
const coffeeRepository = require('../repositories/coffeeRepository');
const chatbotEngine = require('../integrations/chatbotEngine');
const geminiClient = require('../integrations/geminiClient');
const env = require('../config/env');
const { buildPagination } = require('../utils/pagination');

const HISTORY_LIMIT = 6;

function serializeCoffeeForChat(coffee) {
  return {
    id: coffee.id,
    name: coffee.name,
    roastLevel: coffee.roastLevel,
    intensity: coffee.intensity,
    acidity: coffee.acidity,
    bitterness: coffee.bitterness,
    sweetness: coffee.sweetness,
    price: Number(coffee.price),
    category: coffee.Category?.name || null,
    brewingMethod: coffee.BrewingMethod?.name || null,
  };
}

async function loadContext(user) {
  const [coffees, history] = await Promise.all([
    coffeeRepository.findAllActive(),
    user?.id ? chatMessageRepository.findRecentByUserId(user.id, HISTORY_LIMIT) : Promise.resolve([]),
  ]);

  return {
    coffees: coffees.map(serializeCoffeeForChat),
    history: history.map((entry) => ({
      message: entry.message,
      response: entry.response,
    })),
  };
}

async function reply(message, user = null) {
  let response;
  let intent = 'gemini';
  let provider = 'gemini';

  if (env.gemini.enabled && env.gemini.apiKey) {
    try {
      const context = await loadContext(user);
      response = await geminiClient.getChatReply(message, context);
    } catch (error) {
      console.warn(`[chatbot] provider=local-fallback reason=${error.message}`);
      response = null;
    }
  }

  if (!response) {
    const local = chatbotEngine.detectIntent(message);
    response = local.response;
    intent = local.intent;
    provider = 'local';
  }

  const chatMessage = await chatMessageRepository.create({
    userId: user?.id || null,
    message,
    response,
    provider,
  });

  return {
    id: chatMessage.id,
    intent,
    provider,
    message,
    response,
  };
}

async function listHistory(user, { page, limit }) {
  const { rows, count } = await chatMessageRepository.findByUserPaginated(user.id, page, limit);

  return {
    messages: rows.map((entry) => ({
      id: entry.id,
      message: entry.message,
      response: entry.response,
      provider: entry.provider,
      createdAt: entry.createdAt,
    })),
    pagination: buildPagination({ page, limit, total: count }),
  };
}

async function listAll({ page, limit, provider }) {
  const { rows, count } = await chatMessageRepository.findAllPaginated({ page, limit, provider });

  return {
    messages: rows.map((entry) => ({
      id: entry.id,
      message: entry.message,
      response: entry.response,
      provider: entry.provider,
      createdAt: entry.createdAt,
      user: entry.User
        ? { id: entry.User.id, name: entry.User.name, email: entry.User.email }
        : null,
    })),
    pagination: buildPagination({ page, limit, total: count }),
  };
}

module.exports = {
  reply,
  listHistory,
  listAll,
};
