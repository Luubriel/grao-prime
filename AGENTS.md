# AGENTS.md — Instruções para Agente IA

## 1. Papel do agente

Você é um agente IA de desenvolvimento responsável por implementar o backend do projeto **Grão Prime**.

Seu trabalho é construir uma API RESTful em Node.js com JavaScript, Express, MySQL e Sequelize, seguindo os documentos:

- `PLAN.md`
- `SPECS.md`
- `README.md`
- `AGENTS.md`

Você deve desenvolver de forma incremental, organizada, testável e compatível com uma apresentação acadêmica.

---

## 2. Contexto do projeto

O **Grão Prime** é um sistema inteligente de recomendação de cafés.

O backend deve oferecer:

- Cadastro e login de usuários.
- Autenticação com JWT.
- Controle de acesso por perfil.
- Gerenciamento de cafés.
- Gerenciamento de categorias.
- Gerenciamento de métodos de preparo.
- Catálogo público com filtros, busca, ordenação e paginação.
- Recomendação inteligente integrada a serviço Python.
- Fallback local de recomendação.
- ChatBot interativo baseado em regras.
- Dashboard administrativo.
- Documentação Swagger.

---

## 3. Ambiente inicial do agente

O agente começará em uma pasta que já possui:

- Git inicializado.
- Repositório remoto GitHub configurado.
- Nome e e-mail do proprietário já configurados no Git.
- Autenticação SSH configurada.
- Push/fetch protegidos por senha da chave SSH.

Isso significa que o agente deve trabalhar dentro desse repositório existente.

---

## 4. Regras obrigatórias sobre Git

Antes de qualquer alteração, execute:

```bash
git status
```

Pode executar apenas para inspeção:

```bash
git remote -v
```

Não execute:

```bash
git init
git remote remove origin
git remote add origin <url>
git remote set-url origin <url>
git config --global user.name
git config --global user.email
git push
git push --force
git fetch
git pull
```

Exceção:

- `git push`, `git fetch` ou `git pull` só podem ser executados se o usuário solicitar explicitamente.
- Como a chave SSH é protegida por senha, essas operações podem travar aguardando entrada do usuário. Evite-as por padrão.

Commits:

- Faça commits apenas se o usuário solicitar ou se o fluxo de trabalho exigir claramente.
- Antes de commitar, execute `git status`.
- Não inclua `.env` ou arquivos sensíveis no commit.
- Não faça commits gigantes se puder dividir em entregas menores.

Mensagens de commit sugeridas:

```txt
feat: create express base structure
feat: add sequelize database config
feat: implement auth routes
feat: implement category crud
feat: implement brewing method crud
feat: implement coffee crud
feat: add recommendation endpoint
feat: add chatbot endpoint
feat: add dashboard endpoint
feat: add swagger documentation
fix: adjust coffee filters
chore: update readme
```

---

## 5. Restrições técnicas

Use obrigatoriamente:

- Node.js
- JavaScript
- Express
- MySQL
- Sequelize
- JWT
- bcryptjs
- Swagger

Não usar:

- TypeScript, a menos que seja solicitado futuramente.
- PostgreSQL, MongoDB ou Firebase neste backend.
- Frontend neste repositório.
- Serviço pago de IA na primeira versão.

O backend não deve treinar modelo de Machine Learning. O backend deve apenas consumir um serviço Python via HTTP e ter fallback local.

---

## 6. Ordem obrigatória de execução

Siga esta ordem:

1. Inspecionar repositório com `git status`.
2. Verificar estrutura existente.
3. Criar ou ajustar `package.json`.
4. Instalar dependências.
5. Criar `.gitignore`.
6. Criar `.env.example`.
7. Configurar Express.
8. Criar rota `GET /health`.
9. Configurar Sequelize e MySQL.
10. Criar migrations e models.
11. Criar seeders.
12. Implementar autenticação.
13. Implementar middlewares de auth e admin.
14. Implementar CRUD de categorias.
15. Implementar CRUD de métodos de preparo.
16. Implementar CRUD de cafés.
17. Implementar filtros, paginação e ordenação do catálogo.
18. Implementar recomendação integrada ao serviço Python.
19. Implementar fallback local de recomendação.
20. Implementar ChatBot.
21. Implementar dashboard.
22. Implementar Swagger.
23. Revisar README.
24. Testar endpoints.
25. Corrigir erros.

---

## 7. Padrão de arquitetura

Respeite a separação por camadas:

```txt
Controller -> Service -> Repository -> Model
```

Controllers:

- Não devem conter regras de negócio.
- Não devem acessar models diretamente, exceto em casos extremamente simples e justificados.

Services:

- Devem conter regras de negócio.
- Devem coordenar chamadas a repositories e integrações externas.

Repositories:

- Devem concentrar consultas ao banco.

Models:

- Devem representar tabelas e associações.

Middlewares:

- Devem tratar autenticação, autorização, validações e erros.

---

## 8. Estrutura de pastas esperada

Crie e mantenha:

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

Se utilizar Sequelize CLI, também podem existir:

```txt
config/
migrations/
seeders/
```

---

## 9. Padrão de código

Use JavaScript com CommonJS ou ES Modules, mas mantenha consistência em todo o projeto.

Preferência:

```js
const express = require('express');
```

Regras:

- Usar nomes claros.
- Evitar funções muito longas.
- Evitar duplicação.
- Não misturar responsabilidades.
- Não acessar banco diretamente no controller.
- Não deixar senhas, tokens ou credenciais fixas no código.
- Não versionar `.env`.
- Criar `.env.example`.
- Manter padrão de resposta da API.
- Manter Swagger atualizado.

---

## 10. Padrão de resposta

Toda resposta de sucesso deve seguir:

```json
{
  "success": true,
  "data": {}
}
```

Toda resposta de erro deve seguir:

```json
{
  "success": false,
  "message": "Mensagem de erro",
  "errors": []
}
```

Para paginação:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 11. Tratamento de erros

Crie uma classe `AppError`.

Exemplo:

```js
class AppError extends Error {
  constructor(message, statusCode = 400, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

module.exports = AppError;
```

Todos os erros esperados devem usar `AppError`.

Erros inesperados devem retornar status 500.

Não retornar stack trace em produção.

---

## 12. Validação

Validar todos os dados de entrada.

Preferência:

- Zod

Validações obrigatórias:

- Cadastro de usuário.
- Login.
- Cadastro de categoria.
- Cadastro de método de preparo.
- Cadastro de café.
- Filtros de catálogo.
- Questionário de recomendação.
- Mensagem do ChatBot.

Middleware sugerido:

```txt
src/middlewares/validateMiddleware.js
```

Validadores sugeridos:

```txt
src/validators/authValidator.js
src/validators/categoryValidator.js
src/validators/brewingMethodValidator.js
src/validators/coffeeValidator.js
src/validators/recommendationValidator.js
src/validators/chatbotValidator.js
```

---

## 13. Autenticação e autorização

Implementar JWT.

Rotas públicas:

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

Rotas protegidas para ADMIN:

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

A rota `GET /recommendations/user/:userId` deve permitir:

- ADMIN acessar qualquer usuário.
- Usuário comum acessar apenas o próprio histórico.

---

## 14. Banco de dados

Use migrations para criar tabelas.

Use seeders para dados iniciais.

Não criar tabelas manualmente fora das migrations.

Tabelas obrigatórias:

```txt
users
categories
brewing_methods
coffees
recommendations
chat_messages
```

---

## 15. Dados de demonstração

Criar seeders com:

- Admin inicial.
- Usuário comum inicial.
- Categorias de café.
- Métodos de preparo.
- Cafés de exemplo.

Admin:

```txt
email: admin@graoprime.com
senha: admin123
```

Usuário:

```txt
email: user@graoprime.com
senha: user123
```

As senhas devem ser criptografadas.

---

## 16. Recomendação

A rota `POST /recommendations` deve:

1. Validar preferências.
2. Buscar cafés ativos.
3. Enviar dados ao serviço Python.
4. Receber recomendações.
5. Salvar histórico.
6. Retornar resultado.

Payload esperado:

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

Se o serviço Python falhar:

- Não quebrar a API.
- Usar fallback local.
- Retornar recomendações baseadas em similaridade.

O fallback deve considerar:

- `intensity`
- `acidity`
- `bitterness`
- `sweetness`
- `roastLevel`
- `brewingMethodId`

---

## 17. ChatBot

A rota `POST /chatbot/message` deve:

1. Receber mensagem.
2. Detectar intenção simples.
3. Gerar resposta.
4. Salvar mensagem e resposta.
5. Retornar resposta ao frontend.

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

Não integrar serviço pago inicialmente.

Preparar o código para futura troca por OpenAI API, Rasa ou Dialogflow.

---

## 18. Dashboard

A rota `GET /dashboard` deve retornar:

```txt
totalCoffees
activeCoffees
totalCategories
totalBrewingMethods
totalRecommendations
mostRecommendedCoffees
latestRecommendations
```

Acesso:

- Apenas ADMIN.

---

## 19. Swagger

Documentar todos os endpoints.

A documentação deve estar em:

```txt
/api-docs
```

Deve incluir:

- Descrição das rotas.
- Body esperado.
- Query params.
- Responses.
- Status HTTP.
- Autenticação Bearer JWT.
- Schemas principais.

Sempre que criar ou alterar endpoint, atualizar Swagger.

---

## 20. Checklist antes de finalizar

Antes de considerar o backend finalizado, verificar:

- O servidor inicia sem erro.
- O banco conecta corretamente.
- As migrations rodam.
- Os seeders rodam.
- O login retorna JWT.
- O CRUD de cafés funciona.
- O CRUD de categorias funciona.
- O CRUD de métodos funciona.
- Os filtros do catálogo funcionam.
- A recomendação retorna cafés.
- O fallback de recomendação funciona.
- O ChatBot responde mensagens.
- O dashboard retorna dados.
- O Swagger está acessível.
- Rotas admin estão protegidas.
- Senhas estão criptografadas.
- `.env` não está versionado.
- `.env.example` existe.
- README está atualizado.
- `git status` não mostra arquivos sensíveis ou inesperados.

---

## 21. Proibições

Não fazer:

- Não criar frontend neste backend.
- Não salvar senha sem hash.
- Não expor JWT_SECRET.
- Não remover autenticação das rotas administrativas.
- Não acessar banco diretamente nos controllers.
- Não ignorar validações.
- Não deixar endpoints sem documentação.
- Não alterar o nome do projeto.
- Não trocar MySQL por outro banco.
- Não trocar JavaScript por TypeScript sem solicitação.
- Não apagar fisicamente cafés no DELETE; usar soft delete.
- Não executar `git init`.
- Não alterar `origin`.
- Não alterar configuração global de Git.
- Não executar push/fetch/pull sem solicitação explícita.

---

## 22. Resultado esperado

Ao final, o backend deve estar pronto para integração com o frontend React do Grão Prime e com o serviço Python de Machine Learning.

A API deve permitir demonstrar:

- Login administrativo.
- Cadastro e gestão de cafés.
- Catálogo público.
- Filtros e ordenação.
- Questionário de recomendação.
- Recomendação inteligente.
- ChatBot.
- Dashboard.
- Swagger.

O projeto deve estar organizado e adequado para apresentação acadêmica.
