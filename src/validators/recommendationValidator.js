const { z } = require('zod');

const scoreSchema = z.coerce.number().int().min(1).max(5);
const roastLevelSchema = z.enum(['CLARA', 'MEDIA', 'ESCURA']);

const recommendationSchema = z.object({
  body: z.object({
    preferredIntensity: scoreSchema,
    preferredAcidity: scoreSchema,
    preferredBitterness: scoreSchema,
    preferredSweetness: scoreSchema,
    preferredRoastLevel: roastLevelSchema,
    preferredBrewingMethodId: z.coerce.number().int().positive().optional().nullable(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const userHistorySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    userId: z.coerce.number().int().positive('Usuário inválido'),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  recommendationSchema,
  userHistorySchema,
};

