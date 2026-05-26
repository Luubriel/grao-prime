const { Router } = require('express');

const chatbotController = require('../controllers/chatbotController');
const asyncHandler = require('../middlewares/asyncHandler');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { chatbotMessageSchema } = require('../validators/chatbotValidator');

const router = Router();

/**
 * @swagger
 * /chatbot/message:
 *   post:
 *     summary: Envia mensagem ao ChatBot.
 *     tags:
 *       - ChatBot
 *     responses:
 *       201:
 *         description: Resposta gerada pelo ChatBot.
 */
router.post(
  '/message',
  optionalAuthMiddleware,
  validate(chatbotMessageSchema),
  asyncHandler(chatbotController.message),
);

module.exports = router;

