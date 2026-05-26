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
 *     summary: Gera recomendações de cafés.
 *     tags:
 *       - Recommendations
 *     responses:
 *       201:
 *         description: Recomendações geradas.
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

