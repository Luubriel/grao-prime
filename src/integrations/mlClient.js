const axios = require('axios');

const env = require('../config/env');

async function getRecommendations(preferences, coffees) {
  const response = await axios.post(
    `${env.mlServiceUrl}/recommendations`,
    {
      preferences,
      coffees,
    },
    {
      timeout: 3000,
    },
  );

  return response.data;
}

module.exports = {
  getRecommendations,
};

