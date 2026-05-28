const { z } = require('zod');

const chatbotMessageSchema = z.object({
  body: z.object({
    message: z.string().trim().min(1, 'Mensagem é obrigatória').max(1000),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const chatbotHistorySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
  }),
});

const chatbotAdminHistorySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    provider: z.enum(['gemini', 'local']).optional(),
  }),
});

module.exports = {
  chatbotMessageSchema,
  chatbotHistorySchema,
  chatbotAdminHistorySchema,
};
