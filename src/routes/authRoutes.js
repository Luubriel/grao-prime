const { Router } = require('express');

const authController = require('../controllers/authController');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validateMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastra um usuário comum.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Silva
 *               email:
 *                 type: string
 *                 example: maria@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário cadastrado.
 *       409:
 *         description: E-mail já cadastrado.
 */
router.post('/register', validate(registerSchema), asyncHandler(authController.register));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica usuário e retorna JWT.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@graoprime.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login realizado.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/login', validate(loginSchema), asyncHandler(authController.login));

module.exports = router;

