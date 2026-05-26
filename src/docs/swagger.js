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
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Administrador' },
            email: { type: 'string', example: 'admin@graoprime.com' },
            role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'ADMIN' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Especial' },
            description: { type: 'string', example: 'Cafés especiais com qualidade superior.' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        BrewingMethod: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 2 },
            name: { type: 'string', example: 'Espresso' },
            description: { type: 'string', example: 'Método sob pressão.' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Coffee: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Grão Prime Clássico' },
            description: { type: 'string' },
            categoryId: { type: 'integer', example: 1 },
            brewingMethodId: { type: 'integer', example: 1 },
            roastLevel: { type: 'string', enum: ['CLARA', 'MEDIA', 'ESCURA'], example: 'MEDIA' },
            intensity: { type: 'integer', minimum: 1, maximum: 5, example: 3 },
            acidity: { type: 'integer', minimum: 1, maximum: 5, example: 2 },
            bitterness: { type: 'integer', minimum: 1, maximum: 5, example: 3 },
            sweetness: { type: 'integer', minimum: 1, maximum: 5, example: 3 },
            price: { type: 'number', example: 28.9 },
            imageUrl: { type: 'string', nullable: true },
            active: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Recommendation: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', nullable: true, example: 1 },
            preferredIntensity: { type: 'integer', example: 4 },
            preferredAcidity: { type: 'integer', example: 2 },
            preferredBitterness: { type: 'integer', example: 3 },
            preferredSweetness: { type: 'integer', example: 4 },
            preferredRoastLevel: {
              type: 'string',
              enum: ['CLARA', 'MEDIA', 'ESCURA'],
              example: 'MEDIA',
            },
            preferredBrewingMethodId: { type: 'integer', nullable: true, example: 2 },
            recommendedCoffeeId: { type: 'integer', example: 1 },
            score: { type: 'number', example: 85 },
            reason: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ChatMessage: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', nullable: true, example: 1 },
            message: { type: 'string', example: 'Qual café combina comigo?' },
            response: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Mensagem de erro',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
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
