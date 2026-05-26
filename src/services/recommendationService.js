const AppError = require('../utils/AppError');
const brewingMethodRepository = require('../repositories/brewingMethodRepository');
const coffeeRepository = require('../repositories/coffeeRepository');
const recommendationRepository = require('../repositories/recommendationRepository');
const mlClient = require('../integrations/mlClient');

const roastLevelScore = {
  CLARA: 1,
  MEDIA: 2,
  ESCURA: 3,
};

function serializeCoffee(coffee) {
  return {
    id: coffee.id,
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

function normalizeMlResponse(response, coffees) {
  const items = Array.isArray(response) ? response : response.recommendations;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Resposta inválida do serviço de recomendação');
  }

  return items
    .map((item) => {
      const coffeeId = item.coffeeId || item.id || item.recommendedCoffeeId;
      const coffee = coffees.find((entry) => Number(entry.id) === Number(coffeeId));

      if (!coffee) return null;

      return {
        coffee,
        score: Number(item.score ?? 0),
        reason: item.reason || 'Recomendação calculada pelo serviço de Machine Learning.',
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
  let source = 'ML_SERVICE';
  let recommendations;

  try {
    const mlResponse = await mlClient.getRecommendations(preferences, serializedCoffees);
    recommendations = normalizeMlResponse(mlResponse, serializedCoffees);
  } catch (error) {
    source = 'LOCAL_FALLBACK';
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
    })),
  );

  return {
    source,
    recommendations: recommendations.map((item, index) => ({
      id: saved[index].id,
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

