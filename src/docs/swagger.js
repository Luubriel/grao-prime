const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grão Prime API',
      version: '1.0.0',
      description: 'API RESTful do sistema inteligente de recomendação de cafés Grão Prime.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Ambiente local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/docs/*.js'],
};

module.exports = swaggerJsdoc(options);

