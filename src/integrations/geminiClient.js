const { GoogleGenAI } = require('@google/genai');

const env = require('../config/env');

function buildRecommendationPrompt(preferences, coffees) {
  return `
Você é o motor de recomendação do sistema Grão Prime.

Sua tarefa é recomendar cafés com base nas preferências do usuário e na lista de cafés disponíveis.

Regras obrigatórias:
- Responda somente em JSON válido.
- Não use markdown.
- Não invente cafés.
- Recomende apenas cafés presentes na lista recebida.
- Use exatamente o campo coffeeId com IDs existentes.
- Retorne no máximo 5 recomendações.
- O score deve ser um número de 0 a 100.
- A reason deve ser curta, em português do Brasil, com no máximo 180 caracteres.
- Considere intensidade, acidez, amargor, doçura, torra e método de preparo.
- Se nenhum café for ideal, retorne os cafés mais próximos.

Formato obrigatório da resposta:
{
  "recommendations": [
    {
      "coffeeId": 1,
      "score": 92.5,
      "reason": "Motivo curto da recomendação."
    }
  ]
}

Preferências do usuário:
${JSON.stringify(preferences, null, 2)}

Cafés disponíveis:
${JSON.stringify(coffees, null, 2)}
`.trim();
}

function ensureGeminiIsConfigured() {
  if (!env.gemini.enabled) {
    throw new Error('Gemini desativado por configuração');
  }

  if (!env.gemini.apiKey) {
    throw new Error('GEMINI_API_KEY não configurada');
  }
}

async function withTimeout(promise, timeoutMs) {
  let timeoutId;

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Timeout na chamada da Gemini')), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getRecommendations(preferences, coffees) {
  ensureGeminiIsConfigured();

  const startedAt = Date.now();
  const ai = new GoogleGenAI({ apiKey: env.gemini.apiKey });
  const prompt = buildRecommendationPrompt(preferences, coffees);

  const response = await withTimeout(
    ai.models.generateContent({
      model: env.gemini.model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    }),
    env.gemini.timeoutMs,
  );

  console.log(
    `[recommendations] provider=gemini durationMs=${Date.now() - startedAt} coffees=${coffees.length}`,
  );

  return response.text;
}

module.exports = {
  getRecommendations,
};
