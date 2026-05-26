const chatbotService = require('../services/chatbotService');

async function message(req, res) {
  const data = await chatbotService.reply(req.validated.body.message, req.user);

  return res.status(201).json({
    success: true,
    data,
  });
}

module.exports = {
  message,
};

