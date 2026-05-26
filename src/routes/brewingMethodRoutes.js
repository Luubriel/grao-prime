const { Router } = require('express');

const brewingMethodController = require('../controllers/brewingMethodController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  idSchema,
  createBrewingMethodSchema,
  updateBrewingMethodSchema,
} = require('../validators/brewingMethodValidator');

const router = Router();

/**
 * @swagger
 * /brewing-methods:
 *   get:
 *     summary: Lista métodos de preparo.
 *     tags:
 *       - Brewing Methods
 *     responses:
 *       200:
 *         description: Lista de métodos de preparo.
 */
router.get('/', asyncHandler(brewingMethodController.list));

/**
 * @swagger
 * /brewing-methods/{id}:
 *   get:
 *     summary: Busca método de preparo por ID.
 *     tags:
 *       - Brewing Methods
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Método encontrado.
 *       404:
 *         description: Método não encontrado.
 */
router.get('/:id', validate(idSchema), asyncHandler(brewingMethodController.getById));

/**
 * @swagger
 * /brewing-methods:
 *   post:
 *     summary: Cria método de preparo.
 *     tags:
 *       - Brewing Methods
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Método criado.
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validate(createBrewingMethodSchema),
  asyncHandler(brewingMethodController.create),
);

/**
 * @swagger
 * /brewing-methods/{id}:
 *   put:
 *     summary: Atualiza método de preparo.
 *     tags:
 *       - Brewing Methods
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Método atualizado.
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(updateBrewingMethodSchema),
  asyncHandler(brewingMethodController.update),
);

/**
 * @swagger
 * /brewing-methods/{id}:
 *   delete:
 *     summary: Exclui método sem cafés vinculados.
 *     tags:
 *       - Brewing Methods
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Método excluído.
 *       409:
 *         description: Método vinculado a cafés.
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(idSchema),
  asyncHandler(brewingMethodController.remove),
);

module.exports = router;

