const chatbotService = require('../services/chatbotService');

async function message(req, res) {
  const data = await chatbotService.reply(req.validated.body.message, req.user);

  return res.status(201).json({
    success: true,
    data,
  });
}

async function history(req, res) {
  const data = await chatbotService.listHistory(req.user, req.validated.query);

  return res.status(200).json({
    success: true,
    data,
  });
}

async function adminHistory(req, res) {
  const data = await chatbotService.listAll(req.validated.query);

  return res.status(200).json({
    success: true,
    data,
  });
}

module.exports = {
  message,
  history,
  adminHistory,
};
