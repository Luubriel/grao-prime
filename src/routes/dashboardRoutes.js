const { Router } = require('express');

const dashboardController = require('../controllers/dashboardController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retorna indicadores administrativos.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard administrativo.
 */
router.get('/', authMiddleware, adminMiddleware, asyncHandler(dashboardController.show));

module.exports = router;

