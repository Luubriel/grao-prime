const { Router } = require('express');

const recommendationController = require('../controllers/recommendationController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  recommendationSchema,
  userHistorySchema,
} = require('../validators/recommendationValidator');

const router = Router();

/**
 * @swagger
 * /recommendations:
 *   post:
 *     summary: Gera recomendações de cafés com Gemini API ou fallback local.
 *     description: Usa Gemini API quando configurada e ativa. Caso a chamada externa falhe, usa fallback local por similaridade.
 *     tags:
 *       - Recommendations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendationRequest'
 *           example:
 *             preferredIntensity: 4
 *             preferredAcidity: 2
 *             preferredBitterness: 3
 *             preferredSweetness: 4
 *             preferredRoastLevel: MEDIA
 *             preferredBrewingMethodId: 1
 *     responses:
 *       201:
 *         description: Recomendações geradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     provider:
 *                       type: string
 *                       enum: [gemini, local-fallback]
 *                       example: gemini
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RecommendationResult'
 *             examples:
 *               gemini:
 *                 summary: Resposta usando Gemini
 *                 value:
 *                   success: true
 *                   data:
 *                     provider: gemini
 *                     recommendations:
 *                       - coffeeId: 1
 *                         name: Grão Prime Bourbon
 *                         score: 92.5
 *                         reason: Combina com torra média, boa doçura e baixa acidez.
 *               fallback:
 *                 summary: Resposta usando fallback local
 *                 value:
 *                   success: true
 *                   data:
 *                     provider: local-fallback
 *                     recommendations:
 *                       - coffeeId: 1
 *                         name: Grão Prime Bourbon
 *                         score: 86
 *                         reason: Recomendado por similaridade com as preferências informadas.
 *       400:
 *         description: Payload inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Método preferido ou cafés ativos não encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro inesperado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  optionalAuthMiddleware,
  validate(recommendationSchema),
  asyncHandler(recommendationController.create),
);

/**
 * @swagger
 * /recommendations:
 *   get:
 *     summary: Lista histórico de recomendações.
 *     tags:
 *       - Recommendations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico listado.
 */
router.get('/', authMiddleware, adminMiddleware, asyncHandler(recommendationController.list));

/**
 * @swagger
 * /recommendations/user/{userId}:
 *   get:
 *     summary: Lista recomendações de um usuário.
 *     tags:
 *       - Recommendations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico do usuário.
 */
router.get(
  '/user/:userId',
  authMiddleware,
  validate(userHistorySchema),
  asyncHandler(recommendationController.listByUser),
);

module.exports = router;
