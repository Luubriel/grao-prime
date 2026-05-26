const { Router } = require('express');

const coffeeController = require('../controllers/coffeeController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  idSchema,
  createCoffeeSchema,
  updateCoffeeSchema,
  listCoffeeSchema,
} = require('../validators/coffeeValidator');

const router = Router();

/**
 * @swagger
 * /coffees:
 *   get:
 *     summary: Lista cafés ativos com filtros, ordenação e paginação.
 *     tags:
 *       - Coffees
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: roastLevel
 *         schema:
 *           type: string
 *           enum: [CLARA, MEDIA, ESCURA]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista paginada de cafés.
 */
router.get('/', validate(listCoffeeSchema), asyncHandler(coffeeController.list));

/**
 * @swagger
 * /coffees/{id}:
 *   get:
 *     summary: Busca café ativo por ID.
 *     tags:
 *       - Coffees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Café encontrado.
 *       404:
 *         description: Café não encontrado.
 */
router.get('/:id', validate(idSchema), asyncHandler(coffeeController.getById));

/**
 * @swagger
 * /coffees:
 *   post:
 *     summary: Cria café.
 *     tags:
 *       - Coffees
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Café criado.
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validate(createCoffeeSchema),
  asyncHandler(coffeeController.create),
);

/**
 * @swagger
 * /coffees/{id}:
 *   put:
 *     summary: Atualiza café.
 *     tags:
 *       - Coffees
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
 *         description: Café atualizado.
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(updateCoffeeSchema),
  asyncHandler(coffeeController.update),
);

/**
 * @swagger
 * /coffees/{id}:
 *   delete:
 *     summary: Desativa café por soft delete.
 *     tags:
 *       - Coffees
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
 *         description: Café desativado.
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(idSchema),
  asyncHandler(coffeeController.remove),
);

module.exports = router;

