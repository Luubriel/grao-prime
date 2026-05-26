const { Router } = require('express');
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica a disponibilidade da API.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API disponível.
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
 *                     status:
 *                       type: string
 *                       example: ok
 *                     service:
 *                       type: string
 *                       example: grao-prime-backend
 */
router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'grao-prime-backend',
    },
  });
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
