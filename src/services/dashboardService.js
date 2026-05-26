const brewingMethodRepository = require('../repositories/brewingMethodRepository');
const categoryRepository = require('../repositories/categoryRepository');
const coffeeRepository = require('../repositories/coffeeRepository');
const recommendationRepository = require('../repositories/recommendationRepository');

async function getSummary() {
  const [
    totalCoffees,
    activeCoffees,
    categories,
    brewingMethods,
    totalRecommendations,
    mostRecommendedCoffees,
    latestRecommendations,
  ] = await Promise.all([
    coffeeRepository.countAll(),
    coffeeRepository.countActive(),
    categoryRepository.findAll(),
    brewingMethodRepository.findAll(),
    recommendationRepository.countAll(),
    recommendationRepository.mostRecommended(5),
    recommendationRepository.latest(5),
  ]);

  return {
    totalCoffees,
    activeCoffees,
    totalCategories: categories.length,
    totalBrewingMethods: brewingMethods.length,
    totalRecommendations,
    mostRecommendedCoffees,
    latestRecommendations,
  };
}

module.exports = {
  getSummary,
};

