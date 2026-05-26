# Grão Prime Backend

Backend da aplicação **Grão Prime**, um sistema inteligente de recomendação de cafés.

A API permite autenticação de usuários, gerenciamento administrativo de cafés, categorias e métodos de preparo, catálogo público com filtros, integração com serviço Python de Machine Learning para recomendação e endpoint de ChatBot.

---

## 1. Observação sobre o repositório

Este projeto deve ser desenvolvido em uma pasta que já possui:

- Git inicializado.
- Repositório GitHub configurado.
- Nome e e-mail do usuário já configurados no Git.
- Autenticação SSH configurada.
- Push/fetch protegidos por senha da chave SSH.

Não execute `git init` novamente.  
Não altere o remoto do GitHub.  
Não altere o nome ou e-mail configurados no Git.  
Não execute `git push`, `git fetch` ou `git pull` sem solicitação explícita.

---

## 2. Stack

- Node.js
- JavaScript
- Express
- MySQL
- Sequelize
- mysql2
- JWT
- bcryptjs
- dotenv
- cors
- helmet
- morgan
- axios
- zod
- swagger-jsdoc
- swagger-ui-express

---

## 3. Pré-requisitos

Antes de executar o projeto, instale:

- Node.js
- npm
- MySQL

Este projeto deve ser executado com Node via `nvm`. Exemplo:

```bash
nvm use 22.20.0
```

---

## 4. Instalação

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Configure as variáveis conforme o ambiente local.

---

## 5. Variáveis de ambiente

Exemplo de `.env`:

```env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_NAME=grao_prime
DB_USER=root
DB_PASSWORD=

JWT_SECRET=troque_essa_chave
JWT_EXPIRES_IN=1d

CORS_ORIGIN=http://localhost:5173
ML_SERVICE_URL=http://localhost:8000
```

O arquivo `.env` não deve ser versionado.

---

## 6. Scripts previstos

Inicia o servidor em desenvolvimento:

```bash
npm run dev
```

Inicia o servidor em produção:

```bash
npm start
```

Cria o banco de dados:

```bash
npm run db:create
```

Executa migrations:

```bash
npm run db:migrate
```

Executa seeders:

```bash
npm run db:seed
```

Reseta migrations e seeders em desenvolvimento:

```bash
npm run db:reset
```

---

## 7. Estrutura do projeto

```txt
src/
├── app.js
├── server.js
├── config/
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

---

## 8. Rodando localmente

1. Configure o MySQL.
2. Configure o `.env`.
3. Crie o banco:

```bash
npm run db:create
```

4. Execute as migrations:

```bash
npm run db:migrate
```

5. Execute os seeders:

```bash
npm run db:seed
```

6. Inicie o servidor:

```bash
npm run dev
```

O backend ficará disponível em:

```txt
http://localhost:3001
```

---

## 9. Health check

```http
GET /health
```

Resposta esperada:

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

## 10. Swagger

Após iniciar o servidor, acesse:

```txt
http://localhost:3001/api-docs
```

A documentação deve conter todos os endpoints principais, schemas, autenticação JWT e exemplos de resposta.

---

## 11. Autenticação

A API utiliza JWT.

Após realizar login, envie o token nas rotas protegidas:

```http
Authorization: Bearer <token>
```

Usuário administrador inicial:

```txt
email: admin@graoprime.com
senha: admin123
```

Usuário comum inicial:

```txt
email: user@graoprime.com
senha: user123
```

As senhas dos seeders devem ser salvas com hash.

---

## 12. Principais endpoints

### Auth

```http
POST /auth/register
POST /auth/login
```

### Categorias

```http
GET /categories
GET /categories/:id
POST /categories
PUT /categories/:id
DELETE /categories/:id
```

### Métodos de preparo

```http
GET /brewing-methods
GET /brewing-methods/:id
POST /brewing-methods
PUT /brewing-methods/:id
DELETE /brewing-methods/:id
```

### Cafés

```http
GET /coffees
GET /coffees/:id
POST /coffees
PUT /coffees/:id
DELETE /coffees/:id
```

### Recomendações

```http
POST /recommendations
GET /recommendations
GET /recommendations/user/:userId
```

### ChatBot

```http
POST /chatbot/message
```

### Dashboard

```http
GET /dashboard
```

---

## 13. Filtros do catálogo

A rota `GET /coffees` deve aceitar:

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

```http
GET /coffees?roastLevel=MEDIA&minIntensity=3&page=1&limit=10
```

Ordenação permitida:

```txt
name
price
intensity
createdAt
```

Direções permitidas:

```txt
ASC
DESC
```

---

## 14. Integração com Machine Learning

O backend se comunica com um serviço Python externo.

URL configurada por:

```env
ML_SERVICE_URL=http://localhost:8000
```

Fluxo:

1. O frontend envia preferências para `POST /recommendations`.
2. O backend busca cafés ativos no MySQL.
3. O backend envia preferências e cafés ao serviço Python.
4. O serviço Python retorna cafés recomendados.
5. O backend salva o histórico.
6. O backend retorna o resultado ao frontend.

Caso o serviço Python esteja indisponível, o backend deve usar recomendação simples local por similaridade.

---

## 15. ChatBot

O ChatBot inicial funciona por regras no próprio backend.

Ele deve responder perguntas como:

```txt
Qual café combina comigo?
Qual a diferença entre torra clara e escura?
Quero um café menos amargo.
Qual café é melhor para espresso?
Me explique os métodos de preparo.
```

As mensagens devem ser registradas no banco na tabela `chat_messages`.

---

## 16. Padrão de resposta

Sucesso:

```json
{
  "success": true,
  "data": {}
}
```

Lista paginada:

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

Erro:

```json
{
  "success": false,
  "message": "Mensagem de erro",
  "errors": []
}
```

---

## 17. Rotas públicas

```txt
GET /health
POST /auth/register
POST /auth/login
GET /categories
GET /categories/:id
GET /brewing-methods
GET /brewing-methods/:id
GET /coffees
GET /coffees/:id
POST /recommendations
POST /chatbot/message
```

---

## 18. Rotas administrativas

As rotas abaixo exigem token JWT e perfil `ADMIN`:

```txt
POST /categories
PUT /categories/:id
DELETE /categories/:id

POST /brewing-methods
PUT /brewing-methods/:id
DELETE /brewing-methods/:id

POST /coffees
PUT /coffees/:id
DELETE /coffees/:id

GET /recommendations
GET /dashboard
```

---

## 19. Git e commits

Antes de começar alterações:

```bash
git status
```

Se for solicitado commit, use mensagens claras:

```txt
feat: create express base structure
feat: add sequelize database config
feat: implement auth routes
feat: implement coffee crud
feat: add recommendation endpoint
feat: add swagger documentation
fix: adjust coffee filters
```

Não executar push/fetch/pull sem autorização, pois a chave SSH solicita senha.

---

## 20. Observações finais

Este backend faz parte de um projeto acadêmico que integra:

- Design Web.
- Frontend React.
- Backend Node.js.
- Banco de dados MySQL.
- Machine Learning com Python.
- ChatBot.
- Swagger.

O objetivo é entregar uma aplicação funcional, organizada e demonstrável.
