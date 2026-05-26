const { Router } = require('express');

const categoryController = require('../controllers/categoryController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  idSchema,
  createCategorySchema,
  updateCategorySchema,
} = require('../validators/categoryValidator');

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista categorias.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Lista de categorias.
 */
router.get('/', asyncHandler(categoryController.list));

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Busca categoria por ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada.
 *       404:
 *         description: Categoria não encontrada.
 */
router.get('/:id', validate(idSchema), asyncHandler(categoryController.getById));

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria categoria.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Especial
 *               description:
 *                 type: string
 *                 example: Cafés especiais com qualidade superior.
 *     responses:
 *       201:
 *         description: Categoria criada.
 *       403:
 *         description: Acesso restrito a administradores.
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validate(createCategorySchema),
  asyncHandler(categoryController.create),
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza categoria.
 *     tags:
 *       - Categories
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
 *         description: Categoria atualizada.
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(updateCategorySchema),
  asyncHandler(categoryController.update),
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Exclui categoria sem cafés vinculados.
 *     tags:
 *       - Categories
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
 *         description: Categoria excluída.
 *       409:
 *         description: Categoria vinculada a cafés.
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(idSchema),
  asyncHandler(categoryController.remove),
);

module.exports = router;
