# SPECS.md — Especificação Técnica do Backend do Grão Prime

## 1. Visão geral

O backend do Grão Prime é uma API RESTful para uma aplicação web de recomendação de cafés. A aplicação terá uma área pública para usuários finais e uma área administrativa para gestão do catálogo.

A API deve atender ao frontend React, persistir dados em MySQL, integrar-se com um serviço Python de Machine Learning e disponibilizar um ChatBot inicial baseado em regras.

---

## 2. Módulos do backend

O backend será dividido nos seguintes módulos:

1. Health check.
2. Autenticação.
3. Usuários.
4. Categorias.
5. Métodos de preparo.
6. Cafés.
7. Catálogo público.
8. Recomendações.
9. ChatBot.
10. Dashboard administrativo.
11. Swagger.

---

## 3. Stack técnica

### Linguagem

- JavaScript

### Runtime

- Node.js

### Framework HTTP

- Express

### Banco de dados

- MySQL

### ORM

- Sequelize

### Autenticação

- JWT
- bcryptjs

### Documentação

- swagger-jsdoc
- swagger-ui-express

### Validação

- Zod, preferencialmente

### Integrações

- Serviço Python de Machine Learning via HTTP.
- ChatBot interno baseado em regras, com estrutura preparada para futura integração externa.

---

## 4. Arquitetura obrigatória

O backend deve seguir uma arquitetura em camadas:

```txt
Controller
   ↓
Service
   ↓
Repository
   ↓
Model / Database
```

### Responsabilidades

**Controller**

- Receber requisições HTTP.
- Extrair params, query, body e usuário autenticado.
- Chamar services.
- Retornar respostas padronizadas.

**Service**

- Concentrar regras de negócio.
- Validar regras que dependem de dados do banco.
- Coordenar repositories e integrações externas.

**Repository**

- Concentrar acesso ao banco de dados.
- Evitar queries espalhadas pelo projeto.

**Model**

- Representar tabelas do banco.
- Definir associações do Sequelize.

**Middleware**

- Autenticação.
- Autorização.
- Validação.
- Tratamento de erros.

**Integrations**

- Comunicação com serviço Python.
- Motor do ChatBot.

---

## 5. Estrutura de pastas

```txt
src/
├── app.js
├── server.js
├── config/
│   ├── database.js
│   └── env.js
├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
├── middlewares/
├── validators/
├── integrations/
├── docs/
└── utils/
```

Pastas de Sequelize CLI, se utilizadas:

```txt
config/
migrations/
seeders/
```

---

## 6. Padrão de resposta da API

### Sucesso simples

```json
{
  "success": true,
  "data": {}
}
```

### Sucesso com lista paginada

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Erro

```json
{
  "success": false,
  "message": "Mensagem de erro",
  "errors": []
}
```

---

## 7. Status HTTP

Usar os seguintes códigos:

- `200`: sucesso em consulta ou atualização.
- `201`: recurso criado.
- `204`: exclusão/desativação sem corpo de resposta.
- `400`: erro de validação.
- `401`: usuário não autenticado.
- `403`: usuário sem permissão.
- `404`: recurso não encontrado.
- `409`: conflito de dados, como e-mail ou nome duplicado.
- `500`: erro interno inesperado.

---

## 8. Entidades

## 8.1 User

Representa usuários do sistema.

Campos:

```txt
id
name
email
password
role
createdAt
updatedAt
```

Regras:

- `name` é obrigatório.
- `email` é obrigatório, válido e único.
- `password` é obrigatório e deve ser salvo com hash.
- `role` aceita apenas `USER` ou `ADMIN`.
- `role` padrão: `USER`.
- Nunca retornar `password` nas respostas da API.

---

## 8.2 Category

Representa categorias de cafés.

Campos:

```txt
id
name
description
createdAt
updatedAt
```

Exemplos:

- Tradicional.
- Especial.
- Gourmet.
- Orgânico.
- Descafeinado.

Regras:

- `name` é obrigatório.
- `name` deve ser único.
- Não excluir categoria em uso por cafés, a menos que a regra de negócio trate a relação.

---

## 8.3 BrewingMethod

Representa métodos de preparo.

Campos:

```txt
id
name
description
createdAt
updatedAt
```

Exemplos:

- Coado.
- Espresso.
- Prensa francesa.
- Moka.
- Aeropress.

Regras:

- `name` é obrigatório.
- `name` deve ser único.
- Não excluir método em uso por cafés, a menos que a regra de negócio trate a relação.

---

## 8.4 Coffee

Representa os cafés do catálogo.

Campos:

```txt
id
name
description
categoryId
brewingMethodId
roastLevel
intensity
acidity
bitterness
sweetness
price
imageUrl
active
createdAt
updatedAt
```

Regras:

- `name` é obrigatório.
- `categoryId` é obrigatório.
- `brewingMethodId` pode ser obrigatório para manter catálogo mais organizado.
- `roastLevel` aceita `CLARA`, `MEDIA` ou `ESCURA`.
- `intensity` deve ser inteiro de 1 a 5.
- `acidity` deve ser inteiro de 1 a 5.
- `bitterness` deve ser inteiro de 1 a 5.
- `sweetness` deve ser inteiro de 1 a 5.
- `price` deve ser maior ou igual a zero.
- `imageUrl` pode ser nulo.
- `active` padrão: `true`.
- DELETE deve ser soft delete, alterando `active` para `false`.

---

## 8.5 Recommendation

Armazena histórico de recomendações.

Campos:

```txt
id
userId
preferredIntensity
preferredAcidity
preferredBitterness
preferredSweetness
preferredRoastLevel
preferredBrewingMethodId
recommendedCoffeeId
score
reason
createdAt
updatedAt
```

Regras:

- `userId` pode ser nulo para usuário não autenticado.
- `recommendedCoffeeId` deve apontar para um café existente.
- `score` representa compatibilidade de 0 a 100.
- `reason` explica o motivo da recomendação.

---

## 8.6 ChatMessage

Armazena mensagens trocadas com o ChatBot.

Campos:

```txt
id
userId
message
response
createdAt
updatedAt
```

Regras:

- `userId` pode ser nulo.
- `message` é obrigatório.
- `response` é obrigatório.

---

## 9. Rotas

## 9.1 Health check

### GET /health

Acesso: público.

Resposta:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "grao-prime-backend"
  }
}
```

---

## 9.2 Autenticação

### POST /auth/register

Acesso: público.

Body:

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@email.com",
    "role": "USER"
  }
}
```

---

### POST /auth/login

Acesso: público.

Body:

```json
{
  "email": "admin@graoprime.com",
  "password": "admin123"
}
```

Resposta:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Administrador",
      "email": "admin@graoprime.com",
      "role": "ADMIN"
    },
    "token": "jwt-token"
  }
}
```

---

## 9.3 Categorias

### GET /categories

Acesso: público.

Lista categorias.

---

### GET /categories/:id

Acesso: público.

Busca categoria por ID.

---

### POST /categories

Acesso: ADMIN.

Body:

```json
{
  "name": "Especial",
  "description": "Cafés especiais com qualidade superior."
}
```

---

### PUT /categories/:id

Acesso: ADMIN.

Body:

```json
{
  "name": "Gourmet",
  "description": "Categoria de cafés gourmet."
}
```

---

### DELETE /categories/:id

Acesso: ADMIN.

Regra:

- Validar se há cafés vinculados antes de excluir.

---

## 9.4 Métodos de preparo

### GET /brewing-methods

Acesso: público.

Lista métodos de preparo.

---

### GET /brewing-methods/:id

Acesso: público.

Busca método de preparo por ID.

---

### POST /brewing-methods

Acesso: ADMIN.

Body:

```json
{
  "name": "Espresso",
  "description": "Método sob pressão, resultando em bebida intensa."
}
```

---

### PUT /brewing-methods/:id

Acesso: ADMIN.

---

### DELETE /brewing-methods/:id

Acesso: ADMIN.

Regra:

- Validar se há cafés vinculados antes de excluir.

---

## 9.5 Cafés

### GET /coffees

Acesso: público.

Lista cafés ativos com filtros, busca, paginação e ordenação.

Query params:

```txt
search
categoryId
brewingMethodId
roastLevel
minPrice
maxPrice
minIntensity
maxIntensity
orderBy
orderDirection
page
limit
```

Exemplo:

```txt
GET /coffees?roastLevel=MEDIA&minIntensity=3&orderBy=price&orderDirection=ASC&page=1&limit=10
```

---

### GET /coffees/:id

Acesso: público.

Busca café por ID.

---

### POST /coffees

Acesso: ADMIN.

Body:

```json
{
  "name": "Grão Prime Bourbon",
  "description": "Café especial de torra média, sabor equilibrado e notas adocicadas.",
  "categoryId": 1,
  "brewingMethodId": 2,
  "roastLevel": "MEDIA",
  "intensity": 3,
  "acidity": 2,
  "bitterness": 2,
  "sweetness": 4,
  "price": 39.9,
  "imageUrl": "https://exemplo.com/cafe.jpg",
  "active": true
}
```

---

### PUT /coffees/:id

Acesso: ADMIN.

Atualiza café.

---

### DELETE /coffees/:id

Acesso: ADMIN.

Regra:

- Não apagar fisicamente.
- Atualizar `active` para `false`.

---

## 9.6 Recomendações

### POST /recommendations

Acesso: público ou usuário autenticado.

Body:

```json
{
  "preferredIntensity": 4,
  "preferredAcidity": 2,
  "preferredBitterness": 3,
  "preferredSweetness": 4,
  "preferredRoastLevel": "MEDIA",
  "preferredBrewingMethodId": 2
}
```

Resposta:

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "coffeeId": 1,
        "name": "Grão Prime Bourbon",
        "score": 92.5,
        "reason": "Combina com sua preferência por cafés de torra média, doces e equilibrados."
      }
    ]
  }
}
```

---

### GET /recommendations

Acesso: ADMIN.

Lista histórico de recomendações.

---

### GET /recommendations/user/:userId

Acesso: ADMIN ou próprio usuário.

Lista recomendações de um usuário.

---

## 9.7 ChatBot

### POST /chatbot/message

Acesso: público ou usuário autenticado.

Body:

```json
{
  "message": "Quero um café menos amargo"
}
```

Resposta:

```json
{
  "success": true,
  "data": {
    "message": "Quero um café menos amargo",
    "response": "Para um café menos amargo, procure opções de torra clara ou média, com maior doçura e menor intensidade.",
    "suggestions": [
      "Ver cafés suaves",
      "Fazer questionário",
      "Entender tipos de torra"
    ]
  }
}
```

---

## 9.8 Dashboard

### GET /dashboard

Acesso: ADMIN.

Resposta:

```json
{
  "success": true,
  "data": {
    "totalCoffees": 20,
    "activeCoffees": 18,
    "totalCategories": 5,
    "totalBrewingMethods": 6,
    "totalRecommendations": 120,
    "mostRecommendedCoffees": [
      {
        "coffeeId": 1,
        "name": "Grão Prime Bourbon",
        "total": 35
      }
    ]
  }
}
```

---

## 10. Integração com Machine Learning

O backend não treina o modelo. O backend consome o serviço Python via HTTP.

Variável de ambiente:

```txt
ML_SERVICE_URL=http://localhost:8000
```

Endpoint esperado no serviço Python:

```txt
POST /predict
```

Payload enviado pelo backend:

```json
{
  "preferences": {
    "preferredIntensity": 4,
    "preferredAcidity": 2,
    "preferredBitterness": 3,
    "preferredSweetness": 4,
    "preferredRoastLevel": "MEDIA",
    "preferredBrewingMethodId": 2
  },
  "coffees": [
    {
      "id": 1,
      "name": "Grão Prime Bourbon",
      "roastLevel": "MEDIA",
      "intensity": 3,
      "acidity": 2,
      "bitterness": 2,
      "sweetness": 4,
      "brewingMethodId": 2
    }
  ]
}
```

Resposta esperada do serviço Python:

```json
{
  "recommendations": [
    {
      "coffeeId": 1,
      "score": 92.5,
      "reason": "Perfil compatível com torra média, doçura alta e baixa acidez."
    }
  ]
}
```

---

## 11. Fallback local de recomendação

Se o serviço Python estiver indisponível, o backend deve gerar recomendações localmente.

Critérios de similaridade:

- intensity
- acidity
- bitterness
- sweetness
- roastLevel
- brewingMethodId

Sugestão de cálculo:

1. Começar com score 100.
2. Subtrair diferença entre preferências numéricas e atributos do café.
3. Penalizar diferença de torra.
4. Penalizar método de preparo diferente.
5. Ordenar do maior score para o menor.
6. Retornar os 3 a 5 melhores cafés.

---

## 12. ChatBot baseado em regras

O ChatBot inicial deve identificar intenções simples por palavras-chave.

Intenções mínimas:

```txt
saudacao
recomendacao
torra
metodo_preparo
intensidade
acidez
amargor
catalogo
fallback
```

Exemplos:

- Mensagem contém `olá`, `oi`, `bom dia`: intenção `saudacao`.
- Mensagem contém `combina comigo`, `recomende`, `indique`: intenção `recomendacao`.
- Mensagem contém `torra clara`, `torra média`, `torra escura`: intenção `torra`.
- Mensagem contém `espresso`, `coado`, `prensa`, `moka`: intenção `metodo_preparo`.
- Mensagem contém `amargo`, `menos amargo`: intenção `amargor`.

O motor deve ficar isolado em:

```txt
src/integrations/chatbotEngine.js
```

---

## 13. Segurança

Regras obrigatórias:

- Nunca salvar senha em texto puro.
- Nunca versionar `.env`.
- Criar `.env.example`.
- JWT_SECRET deve vir de variável de ambiente.
- Rotas administrativas exigem autenticação.
- Rotas administrativas exigem perfil `ADMIN`.
- Validar dados de entrada.
- Não retornar stack trace em produção.
- Sanitizar parâmetros de filtro e ordenação.
- Não permitir `orderBy` livre sem whitelist.

---

## 14. Swagger

A documentação deve estar disponível em:

```txt
GET /api-docs
```

Documentar:

- Auth
- Categories
- Brewing Methods
- Coffees
- Recommendations
- ChatBot
- Dashboard
- Schemas
- JWT Bearer Auth
- Status de erro

---

## 15. Dados iniciais

Criar seed com:

- 1 usuário administrador.
- 1 usuário comum.
- 5 categorias.
- 5 métodos de preparo.
- 10 cafés.

Admin inicial:

```txt
email: admin@graoprime.com
senha: admin123
role: ADMIN
```

Usuário comum inicial:

```txt
email: user@graoprime.com
senha: user123
role: USER
```

As senhas devem ser salvas com hash.

---

## 16. Critérios de qualidade

O backend deve:

- Separar responsabilidades.
- Evitar regra de negócio em controllers.
- Evitar queries espalhadas pelo código.
- Centralizar tratamento de erros.
- Centralizar validações.
- Usar nomes claros.
- Manter Swagger atualizado.
- Manter README atualizado.
- Ter código simples de demonstrar em apresentação acadêmica.
