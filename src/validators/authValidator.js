const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().trim().email('E-mail inválido').toLowerCase(),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('E-mail inválido').toLowerCase(),
    password: z.string().min(1, 'Senha é obrigatória'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
};

