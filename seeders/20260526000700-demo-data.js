'use strict';

const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await queryInterface.bulkDelete('chat_messages', null, {});
    await queryInterface.bulkDelete('recommendations', null, {});
    await queryInterface.bulkDelete('coffees', {
      name: {
        [Op.in]: [
        'Grão Prime Clássico',
        'Montanhas do Sul',
        'Espresso Prime',
        'Orgânico Serra Verde',
        'Descafeinado Suave',
        ],
      },
    });

    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          name: 'Administrador',
          email: 'admin@graoprime.com',
          password: adminPassword,
          role: 'ADMIN',
          created_at: now,
          updated_at: now,
        },
        {
          id: 2,
          name: 'Usuário Demonstração',
          email: 'user@graoprime.com',
          password: userPassword,
          role: 'USER',
          created_at: now,
          updated_at: now,
        },
      ],
      {
        updateOnDuplicate: ['name', 'email', 'password', 'role', 'updated_at'],
      },
    );

    await queryInterface.bulkInsert(
      'categories',
      [
        {
          id: 1,
          name: 'Tradicional',
          description: 'Cafés equilibrados para consumo diário.',
          created_at: now,
          updated_at: now,
        },
        {
          id: 2,
          name: 'Especial',
          description: 'Cafés de alta qualidade com perfis sensoriais marcantes.',
          created_at: now,
          updated_at: now,
        },
        {
          id: 3,
          name: 'Gourmet',
          description: 'Cafés selecionados com torra cuidadosa.',
          created_at: now,
          updated_at: now,
        },
        {
          id: 4,
          name: 'Orgânico',
          description: 'Cafés produzidos com manejo orgânico.',
          created_at: now,
          updated_at: now,
        },
        {
          id: 5,
          name: 'Descafeinado',
          description: 'Cafés com teor reduzido de cafeína.',
          created_at: now,
          updated_at: now,
        },
      ],
      {
        updateOnDuplicate: ['name', 'description', 'updated_at'],
      },
    );

    await queryInterface.bulkInsert(
      'brewing_methods',
      [
        {
          id: 1,
          name: 'Coado',
          description: 'Preparo filtrado, limpo e versátil.',
          created_at: now,
          updated_at: now,
        },
        {
          id: 2,
          name: 'Espresso',
          description: 'Extração sob pressão, intensa e encorpada.',
          created_at: now,
          updated_at: now,
        },
        {
          id: 3,
          name: 'Prensa francesa',
          description: 'Infusão com corpo alto e textura marcante.',
          created_at: now,
          updated_at: now,
        },
        {
          id: 4,
          name: 'Moka',
          description: 'Preparo concentrado em cafeteira italiana.',
          created_at: now,
          updated_at: now,
        },
        {
          id: 5,
          name: 'Aeropress',
          description: 'Método flexível para bebidas limpas ou intensas.',
          created_at: now,
          updated_at: now,
        },
      ],
      {
        updateOnDuplicate: ['name', 'description', 'updated_at'],
      },
    );

    await queryInterface.bulkInsert('coffees', [
      {
        name: 'Grão Prime Clássico',
        description: 'Café de perfil equilibrado, ideal para o dia a dia.',
        category_id: 1,
        brewing_method_id: 1,
        roast_level: 'MEDIA',
        intensity: 3,
        acidity: 2,
        bitterness: 3,
        sweetness: 3,
        price: 28.9,
        image_url: null,
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Montanhas do Sul',
        description: 'Café especial com doçura elevada e acidez delicada.',
        category_id: 2,
        brewing_method_id: 1,
        roast_level: 'CLARA',
        intensity: 2,
        acidity: 4,
        bitterness: 1,
        sweetness: 5,
        price: 44.9,
        image_url: null,
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Espresso Prime',
        description: 'Blend intenso para espresso com corpo alto.',
        category_id: 3,
        brewing_method_id: 2,
        roast_level: 'ESCURA',
        intensity: 5,
        acidity: 1,
        bitterness: 4,
        sweetness: 2,
        price: 39.9,
        image_url: null,
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Orgânico Serra Verde',
        description: 'Café orgânico com notas doces e final suave.',
        category_id: 4,
        brewing_method_id: 5,
        roast_level: 'MEDIA',
        intensity: 3,
        acidity: 3,
        bitterness: 2,
        sweetness: 4,
        price: 49.9,
        image_url: null,
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Descafeinado Suave',
        description: 'Opção descafeinada com baixa amargura.',
        category_id: 5,
        brewing_method_id: 3,
        roast_level: 'MEDIA',
        intensity: 2,
        acidity: 2,
        bitterness: 1,
        sweetness: 3,
        price: 35.9,
        image_url: null,
        active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('coffees', {
      name: {
        [Op.in]: [
        'Grão Prime Clássico',
        'Montanhas do Sul',
        'Espresso Prime',
        'Orgânico Serra Verde',
        'Descafeinado Suave',
        ],
      },
    });
    await queryInterface.bulkDelete('brewing_methods', {
      name: {
        [Op.in]: ['Coado', 'Espresso', 'Prensa francesa', 'Moka', 'Aeropress'],
      },
    });
    await queryInterface.bulkDelete('categories', {
      name: {
        [Op.in]: ['Tradicional', 'Especial', 'Gourmet', 'Orgânico', 'Descafeinado'],
      },
    });
    await queryInterface.bulkDelete('users', {
      email: {
        [Op.in]: ['admin@graoprime.com', 'user@graoprime.com'],
      },
    });
  },
};
