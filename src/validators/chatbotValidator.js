const { z } = require('zod');

const chatbotMessageSchema = z.object({
  body: z.object({
    message: z.string().trim().min(1, 'Mensagem é obrigatória').max(1000),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  chatbotMessageSchema,
};

