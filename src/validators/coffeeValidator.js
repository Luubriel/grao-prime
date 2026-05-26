const { z } = require('zod');

const roastLevelSchema = z.enum(['CLARA', 'MEDIA', 'ESCURA']);
const idParam = z.coerce.number().int().positive('ID inválido');
const scoreSchema = z.coerce.number().int().min(1).max(5);

const optionalText = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value === '' ? null : value));

const coffeeBody = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: optionalText,
  categoryId: z.coerce.number().int().positive('Categoria inválida'),
  brewingMethodId: z.coerce.number().int().positive('Método de preparo inválido'),
  roastLevel: roastLevelSchema,
  intensity: scoreSchema,
  acidity: scoreSchema,
  bitterness: scoreSchema,
  sweetness: scoreSchema,
  price: z.coerce.number().min(0, 'Preço deve ser maior ou igual a zero'),
  imageUrl: optionalText,
  active: z.boolean().optional(),
});

const idSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: idParam,
  }),
  query: z.object({}).optional(),
});

const createCoffeeSchema = z.object({
  body: coffeeBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateCoffeeSchema = z.object({
  body: coffeeBody,
  params: z.object({
    id: idParam,
  }),
  query: z.object({}).optional(),
});

const listCoffeeSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    search: z.string().trim().optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    brewingMethodId: z.coerce.number().int().positive().optional(),
    roastLevel: roastLevelSchema.optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    minIntensity: scoreSchema.optional(),
    maxIntensity: scoreSchema.optional(),
    orderBy: z.enum(['name', 'price', 'intensity', 'createdAt']).default('createdAt'),
    orderDirection: z
      .string()
      .trim()
      .toUpperCase()
      .pipe(z.enum(['ASC', 'DESC']))
      .default('DESC'),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
});

module.exports = {
  idSchema,
  createCoffeeSchema,
  updateCoffeeSchema,
  listCoffeeSchema,
};

