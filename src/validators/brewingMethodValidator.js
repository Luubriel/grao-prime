const { z } = require('zod');

const idParam = z.coerce.number().int().positive('ID inválido');

const brewingMethodBody = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().trim().optional().nullable(),
});

const idSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: idParam,
  }),
  query: z.object({}).optional(),
});

const createBrewingMethodSchema = z.object({
  body: brewingMethodBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateBrewingMethodSchema = z.object({
  body: brewingMethodBody,
  params: z.object({
    id: idParam,
  }),
  query: z.object({}).optional(),
});

module.exports = {
  idSchema,
  createBrewingMethodSchema,
  updateBrewingMethodSchema,
};

