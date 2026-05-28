const intents = [
  {
    name: 'saudacao',
    keywords: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'ei'],
    response: 'Olá! Posso ajudar você a entender cafés, métodos de preparo ou escolher uma recomendação.',
  },
  {
    name: 'recomendacao',
    keywords: ['recomenda', 'recomendacao', 'combina', 'indica', 'indicacao', 'sugere', 'sugestao'],
    response:
      'Para recomendar um café, responda ao questionário de preferências com intensidade, acidez, amargor, doçura, torra e método.',
  },
  {
    name: 'torra',
    keywords: ['torra', 'torrado', 'clara', 'media', 'escura'],
    response:
      'Torras claras tendem a preservar acidez e notas delicadas; médias equilibram doçura e corpo; escuras destacam intensidade e amargor.',
  },
  {
    name: 'metodo_preparo',
    keywords: ['metodo', 'preparo', 'espresso', 'coado', 'prensa', 'moka', 'aeropress', 'filtro'],
    response:
      'Métodos filtrados costumam gerar bebidas limpas. Espresso e moka entregam mais intensidade. Prensa francesa destaca corpo.',
  },
  {
    name: 'intensidade',
    keywords: ['intenso', 'intensidade', 'forte', 'fraco', 'encorpado'],
    response:
      'A intensidade indica a força percebida do café. Para algo mais marcante, procure intensidade 4 ou 5.',
  },
  {
    name: 'acidez',
    keywords: ['acidez', 'acido', 'frutado', 'citrico'],
    response:
      'A acidez traz vivacidade e brilho ao café. Cafés de torra clara geralmente apresentam acidez mais perceptível.',
  },
  {
    name: 'amargor',
    keywords: ['amargor', 'amargo'],
    response:
      'Para menos amargor, prefira cafés com bitterness baixo, torra clara ou média e preparo coado.',
  },
  {
    name: 'docura',
    keywords: ['doce', 'docura', 'docinho', 'acucarado'],
    response:
      'A doçura é percebida como notas de caramelo, mel ou chocolate. Cafés de torra média costumam destacá-la.',
  },
  {
    name: 'catalogo',
    keywords: ['catalogo', 'cafes', 'lista', 'produtos', 'cardapio'],
    response:
      'Você pode explorar o catálogo filtrando por torra, intensidade, preço, categoria e método de preparo.',
  },
];

const MIN_CONFIDENCE = 1;

function normalize(message) {
  return message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function tokenize(message) {
  return normalize(message)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function scoreIntent(intent, normalizedMessage, tokens) {
  let score = 0;

  for (const keyword of intent.keywords) {
    const normalizedKeyword = normalize(keyword);

    if (normalizedKeyword.includes(' ')) {
      if (normalizedMessage.includes(normalizedKeyword)) score += 2;
      continue;
    }

    if (tokens.includes(normalizedKeyword)) score += 2;
    else if (normalizedMessage.includes(normalizedKeyword)) score += 1;
  }

  return score;
}

function detectIntent(message) {
  const normalizedMessage = normalize(message);
  const tokens = tokenize(message);

  let best = { intent: null, score: 0 };

  for (const intent of intents) {
    const score = scoreIntent(intent, normalizedMessage, tokens);

    if (score > best.score) {
      best = { intent, score };
    }
  }

  if (best.intent && best.score >= MIN_CONFIDENCE) {
    return {
      intent: best.intent.name,
      response: best.intent.response,
      confidence: best.score,
    };
  }

  return {
    intent: 'fallback',
    confidence: 0,
    response:
      'Ainda não entendi totalmente sua pergunta. Posso falar sobre recomendações, torra, métodos, intensidade, acidez, amargor, doçura ou catálogo.',
  };
}

module.exports = {
  detectIntent,
};
