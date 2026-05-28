const { Router } = require('express');

const chatbotController = require('../controllers/chatbotController');
const asyncHandler = require('../middlewares/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');
const { createRateLimiter } = require('../middlewares/rateLimitMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { chatbotHistorySchema, chatbotMessageSchema } = require('../validators/chatbotValidator');

const router = Router();

const messageRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  keyResolver: (req) => (req.user?.id ? `user:${req.user.id}` : `ip:${req.ip}`),
});

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
 *       429:
 *         description: Excesso de requisições.
 */
router.post(
  '/message',
  optionalAuthMiddleware,
  messageRateLimiter,
  validate(chatbotMessageSchema),
  asyncHandler(chatbotController.message),
);

/**
 * @swagger
 * /chatbot/messages:
 *   get:
 *     summary: Lista o histórico de mensagens do usuário autenticado.
 *     tags:
 *       - ChatBot
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Histórico paginado.
 */
router.get(
  '/messages',
  authMiddleware,
  validate(chatbotHistorySchema),
  asyncHandler(chatbotController.history),
);

module.exports = router;
