const { z } = require('zod');

const idParam = z.coerce.number().int().positive('ID inválido');

const categoryBody = z.object({
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

const createCategorySchema = z.object({
  body: categoryBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateCategorySchema = z.object({
  body: categoryBody,
  params: z.object({
    id: idParam,
  }),
  query: z.object({}).optional(),
});

module.exports = {
  idSchema,
  createCategorySchema,
  updateCategorySchema,
};

