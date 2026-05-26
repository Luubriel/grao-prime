const chatMessageRepository = require('../repositories/chatMessageRepository');
const chatbotEngine = require('../integrations/chatbotEngine');

async function reply(message, user = null) {
  const result = chatbotEngine.detectIntent(message);
  const chatMessage = await chatMessageRepository.create({
    userId: user?.id || null,
    message,
    response: result.response,
  });

  return {
    id: chatMessage.id,
    intent: result.intent,
    message,
    response: result.response,
  };
}

module.exports = {
  reply,
};

