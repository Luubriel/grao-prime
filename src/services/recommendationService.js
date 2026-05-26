const AppError = require('../utils/AppError');
const brewingMethodRepository = require('../repositories/brewingMethodRepository');
const coffeeRepository = require('../repositories/coffeeRepository');
const recommendationRepository = require('../repositories/recommendationRepository');
const geminiClient = require('../integrations/geminiClient');

const roastLevelScore = {
  CLARA: 1,
  MEDIA: 2,
  ESCURA: 3,
};

function serializeCoffee(coffee) {
  return {
    id: coffee.id,
    coffeeId: coffee.id,
    name: coffee.name,
    description: coffee.description,
    categoryId: coffee.categoryId,
    brewingMethodId: coffee.brewingMethodId,
    roastLevel: coffee.roastLevel,
    intensity: coffee.intensity,
    acidity: coffee.acidity,
    bitterness: coffee.bitterness,
    sweetness: coffee.sweetness,
    price: Number(coffee.price),
  };
}

function clampScore(score) {
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) {
    return null;
  }

  return Math.min(100, Math.max(0, Number(numericScore.toFixed(2))));
}

function localScore(preferences, coffee) {
  const traitDistance =
    Math.abs(preferences.preferredIntensity - coffee.intensity) +
    Math.abs(preferences.preferredAcidity - coffee.acidity) +
    Math.abs(preferences.preferredBitterness - coffee.bitterness) +
    Math.abs(preferences.preferredSweetness - coffee.sweetness);

  const roastDistance = Math.abs(
    roastLevelScore[preferences.preferredRoastLevel] - roastLevelScore[coffee.roastLevel],
  );
  const methodPenalty =
    preferences.preferredBrewingMethodId &&
    Number(preferences.preferredBrewingMethodId) !== Number(coffee.brewingMethodId)
      ? 2
      : 0;

  const maxDistance = 16 + 2 + 2;
  const distance = traitDistance + roastDistance + methodPenalty;

  return Math.max(0, Math.round(((maxDistance - distance) / maxDistance) * 100));
}

function fallbackRecommendations(preferences, coffees) {
  return coffees
    .map((coffee) => ({
      coffee,
      score: localScore(preferences, coffee),
      reason: `Compatível com intensidade ${preferences.preferredIntensity}, torra ${preferences.preferredRoastLevel} e preferências sensoriais informadas.`,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function parseGeminiResponse(response) {
  if (typeof response === 'object' && response !== null) {
    return response;
  }

  if (typeof response !== 'string') {
    throw new Error('Resposta inválida da Gemini');
  }

  const sanitized = response
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  return JSON.parse(sanitized);
}

function normalizeGeminiRecommendations(response, coffees) {
  const parsedResponse = parseGeminiResponse(response);
  const items = Array.isArray(parsedResponse) ? parsedResponse : parsedResponse.recommendations;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Resposta inválida da Gemini');
  }

  return items
    .map((item) => {
      const coffeeId = item.coffeeId || item.id || item.recommendedCoffeeId;
      const coffee = coffees.find((entry) => Number(entry.id) === Number(coffeeId));
      const score = clampScore(item.score);

      if (!coffee || score === null) return null;

      return {
        coffee,
        score,
        reason:
          typeof item.reason === 'string' && item.reason.trim()
            ? item.reason.trim().slice(0, 180)
            : 'Recomendado por análise das preferências informadas.',
      };
    })
    .filter(Boolean)
    .slice(0, 5);
}

async function validatePreferredMethod(preferredBrewingMethodId) {
  if (!preferredBrewingMethodId) return;

  const method = await brewingMethodRepository.findById(preferredBrewingMethodId);

  if (!method) {
    throw new AppError('Método de preparo preferido não encontrado', 404);
  }
}

async function create(preferences, user = null) {
  await validatePreferredMethod(preferences.preferredBrewingMethodId);

  const coffees = await coffeeRepository.findAllActive();

  if (coffees.length === 0) {
    throw new AppError('Nenhum café ativo disponível para recomendação', 404);
  }

  const serializedCoffees = coffees.map(serializeCoffee);
  let provider = 'gemini';
  let recommendations;

  try {
    const geminiResponse = await geminiClient.getRecommendations(preferences, serializedCoffees);
    recommendations = normalizeGeminiRecommendations(geminiResponse, serializedCoffees);

    if (recommendations.length === 0) {
      throw new Error('Gemini não retornou recomendações válidas');
    }
  } catch (error) {
    provider = 'local-fallback';
    console.warn(`[recommendations] provider=local-fallback reason=${error.message}`);
    recommendations = fallbackRecommendations(preferences, serializedCoffees);
  }

  const saved = await recommendationRepository.bulkCreate(
    recommendations.map((item) => ({
      userId: user?.id || null,
      preferredIntensity: preferences.preferredIntensity,
      preferredAcidity: preferences.preferredAcidity,
      preferredBitterness: preferences.preferredBitterness,
      preferredSweetness: preferences.preferredSweetness,
      preferredRoastLevel: preferences.preferredRoastLevel,
      preferredBrewingMethodId: preferences.preferredBrewingMethodId || null,
      recommendedCoffeeId: item.coffee.id,
      score: item.score,
      reason: item.reason,
      provider,
    })),
  );

  return {
    provider,
    source: provider,
    recommendations: recommendations.map((item, index) => ({
      id: saved[index].id,
      coffeeId: item.coffee.id,
      name: item.coffee.name,
      coffee: item.coffee,
      score: item.score,
      reason: item.reason,
    })),
  };
}

async function list() {
  return recommendationRepository.findAll();
}

async function listByUser(requestUser, userId) {
  if (requestUser.role !== 'ADMIN' && Number(requestUser.id) !== Number(userId)) {
    throw new AppError('Você não pode acessar o histórico deste usuário', 403);
  }

  return recommendationRepository.findByUserId(userId);
}

module.exports = {
  create,
  list,
  listByUser,
};
