const intents = [
  {
    name: 'saudacao',
    keywords: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'],
    response: 'Olá! Posso ajudar você a entender cafés, métodos de preparo ou escolher uma recomendação.',
  },
  {
    name: 'recomendacao',
    keywords: ['recomenda', 'combina', 'indica', 'sugere'],
    response:
      'Para recomendar um café, responda ao questionário de preferências com intensidade, acidez, amargor, doçura, torra e método.',
  },
  {
    name: 'torra',
    keywords: ['torra', 'clara', 'média', 'media', 'escura'],
    response:
      'Torras claras tendem a preservar acidez e notas delicadas; médias equilibram doçura e corpo; escuras destacam intensidade e amargor.',
  },
  {
    name: 'metodo_preparo',
    keywords: ['método', 'metodo', 'preparo', 'espresso', 'coado', 'prensa', 'moka', 'aeropress'],
    response:
      'Métodos filtrados costumam gerar bebidas limpas. Espresso e moka entregam mais intensidade. Prensa francesa destaca corpo.',
  },
  {
    name: 'intensidade',
    keywords: ['intenso', 'intensidade', 'forte', 'fraco'],
    response:
      'A intensidade indica a força percebida do café. Para algo mais marcante, procure intensidade 4 ou 5.',
  },
  {
    name: 'acidez',
    keywords: ['acidez', 'ácido', 'acido'],
    response:
      'A acidez traz vivacidade e brilho ao café. Cafés de torra clara geralmente apresentam acidez mais perceptível.',
  },
  {
    name: 'amargor',
    keywords: ['amargor', 'amargo', 'menos amargo'],
    response:
      'Para menos amargor, prefira cafés com bitterness baixo, torra clara ou média e preparo coado.',
  },
  {
    name: 'catalogo',
    keywords: ['catálogo', 'catalogo', 'cafés', 'cafes', 'lista'],
    response:
      'Você pode explorar o catálogo filtrando por torra, intensidade, preço, categoria e método de preparo.',
  },
];

function normalize(message) {
  return message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function detectIntent(message) {
  const normalizedMessage = normalize(message);
  const intent = intents.find((item) =>
    item.keywords.some((keyword) => normalizedMessage.includes(normalize(keyword))),
  );

  if (intent) {
    return {
      intent: intent.name,
      response: intent.response,
    };
  }

  return {
    intent: 'fallback',
    response:
      'Ainda não entendi totalmente sua pergunta. Posso falar sobre recomendações, torra, métodos, intensidade, acidez, amargor ou catálogo.',
  };
}

module.exports = {
  detectIntent,
};

