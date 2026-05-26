# PLAN.md — Plano de Ação do Backend do Grão Prime

## 1. Contexto do projeto

**Nome do projeto:** Grão Prime  
**Tema:** Sistema inteligente de recomendação de cafés  
**Tipo:** API RESTful para aplicação web  
**Frontend previsto:** React com JavaScript  
**Backend:** Node.js com JavaScript e Express  
**Banco de dados:** MySQL  
**Machine Learning:** Serviço Python consumido via API  
**Documentação:** Swagger  

O backend do Grão Prime será responsável por autenticação, gerenciamento administrativo, catálogo público de cafés, filtros, ordenação, recomendação inteligente, ChatBot e dashboard administrativo.

O agente IA deve desenvolver o backend dentro de uma pasta que já possui Git inicializado, repositório remoto configurado no GitHub e dados de usuário Git configurados com o nome e e-mail do responsável pelo projeto.

---

## 2. Observação importante sobre Git

O agente já começará em uma pasta com:

- Git inicializado.
- Repositório GitHub configurado como remoto.
- Nome e e-mail do usuário já configurados.
- Autenticação SSH configurada.
- Push/fetch protegidos por senha da chave SSH.

Portanto, o agente deve seguir estas regras:

- Não executar `git init`.
- Não alterar `user.name` ou `user.email`.
- Não alterar a URL do repositório remoto.
- Não remover ou recriar o remoto `origin`.
- Não executar `git push` ou `git fetch` sem solicitação explícita.
- Não executar `git push --force`.
- Antes de alterar arquivos, executar `git status` para entender o estado do repositório.
- Fazer commits apenas se solicitado ou se o fluxo de trabalho pedir claramente.
- Caso realize commits, usar mensagens pequenas e objetivas.

---

## 3. Objetivo do backend

Criar uma API RESTful em Node.js com JavaScript, Express e MySQL para atender ao frontend do Grão Prime.

A API deve permitir:

- Cadastro e login de usuários.
- Autenticação com JWT.
- Controle de perfis `USER` e `ADMIN`.
- CRUD de categorias de café.
- CRUD de métodos de preparo.
- CRUD de cafés.
- Catálogo público com filtros, busca, paginação e ordenação.
- Recomendação de cafés integrada a um serviço Python.
- Fallback local de recomendação caso o serviço Python esteja indisponível.
- ChatBot inicial baseado em regras.
- Dashboard administrativo.
- Documentação Swagger.
- Seeds de demonstração.

---

## 4. Stack obrigatória

O agente deve usar:

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
- swagger-jsdoc
- swagger-ui-express
- axios
- zod ou joi

Preferência de validação: **Zod**.

Não usar TypeScript neste backend, salvo se solicitado posteriormente.

---

## 5. Estrutura inicial esperada

Criar ou ajustar a estrutura para ficar próxima de:

```txt
src/
├── app.js
├── server.js
├── config/
│   ├── database.js
│   └── env.js
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   ├── brewingMethodController.js
│   ├── coffeeController.js
│   ├── recommendationController.js
│   ├── chatbotController.js
│   └── dashboardController.js
├── services/
│   ├── authService.js
│   ├── categoryService.js
│   ├── brewingMethodService.js
│   ├── coffeeService.js
│   ├── recommendationService.js
│   ├── chatbotService.js
│   └── dashboardService.js
├── repositories/
│   ├── userRepository.js
│   ├── categoryRepository.js
│   ├── brewingMethodRepository.js
│   ├── coffeeRepository.js
│   ├── recommendationRepository.js
│   └── chatMessageRepository.js
├── models/
│   ├── index.js
│   ├── User.js
│   ├── Category.js
│   ├── BrewingMethod.js
│   ├── Coffee.js
│   ├── Recommendation.js
│   └── ChatMessage.js
├── routes/
│   ├── index.js
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── brewingMethodRoutes.js
│   ├── coffeeRoutes.js
│   ├── recommendationRoutes.js
│   ├── chatbotRoutes.js
│   └── dashboardRoutes.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   ├── validateMiddleware.js
│   └── errorMiddleware.js
├── validators/
│   ├── authValidator.js
│   ├── categoryValidator.js
│   ├── brewingMethodValidator.js
│   ├── coffeeValidator.js
│   ├── recommendationValidator.js
│   └── chatbotValidator.js
├── integrations/
│   ├── mlClient.js
│   └── chatbotEngine.js
├── docs/
│   └── swagger.js
└── utils/
    ├── AppError.js
    └── pagination.js
```

---

## 6. Etapas de desenvolvimento

## Etapa 1 — Verificação inicial do repositório

Tarefas:

- Executar `pwd` para confirmar a pasta atual.
- Executar `git status`.
- Executar `git remote -v` apenas para inspecionar, sem alterar.
- Verificar se já existe `package.json`.
- Verificar se já existe estrutura anterior.

Critério de aceite:

- O agente entende o estado inicial do projeto antes de criar ou modificar arquivos.

---

## Etapa 2 — Configuração base do Node.js

Tarefas:

- Se não existir `package.json`, executar `npm init -y`.
- Instalar dependências principais.
- Criar scripts em `package.json`.
- Criar `.gitignore`.
- Criar `.env.example`.
- Criar estrutura de pastas.
- Criar `src/app.js`.
- Criar `src/server.js`.
- Criar rota `GET /health`.

Scripts sugeridos:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "db:create": "npx sequelize-cli db:create",
    "db:migrate": "npx sequelize-cli db:migrate",
    "db:seed": "npx sequelize-cli db:seed:all",
    "db:reset": "npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all"
  }
}
```

Critério de aceite:

- `npm run dev` deve iniciar o servidor.
- `GET /health` deve retornar status 200.

---

## Etapa 3 — Configuração do MySQL com Sequelize

Tarefas:

- Instalar `sequelize`, `mysql2` e `sequelize-cli`.
- Configurar Sequelize.
- Criar `config/config.js` ou configuração equivalente compatível com sequelize-cli.
- Criar models e migrations.
- Garantir que dados sensíveis venham do `.env`.

Tabelas mínimas:

- users
- categories
- brewing_methods
- coffees
- recommendations
- chat_messages

Critério de aceite:

- `npm run db:create` cria o banco.
- `npm run db:migrate` executa migrations.
- As tabelas são criadas corretamente.

---

## Etapa 4 — Models e relacionamentos

Criar os models:

- User
- Category
- BrewingMethod
- Coffee
- Recommendation
- ChatMessage

Relacionamentos mínimos:

- Category tem muitos Coffee.
- BrewingMethod tem muitos Coffee.
- Coffee pertence a Category.
- Coffee pertence a BrewingMethod.
- User tem muitas Recommendations.
- Coffee tem muitas Recommendations.
- User tem muitas ChatMessages.

Critério de aceite:

- Models carregam sem erro.
- Relacionamentos funcionam em consultas com `include`.

---

## Etapa 5 — Seeds de demonstração

Criar seeds para:

- 1 usuário administrador.
- 1 usuário comum.
- Categorias de café.
- Métodos de preparo.
- Cafés de exemplo.

Credenciais de desenvolvimento:

```txt
Admin:
email: admin@graoprime.com
senha: admin123

Usuário comum:
email: user@graoprime.com
senha: user123
```

Regras:

- Senhas sempre com hash usando bcryptjs.
- Seeds apenas para desenvolvimento e apresentação.

Critério de aceite:

- `npm run db:seed` popula o banco.
- Login com admin funciona.

---

## Etapa 6 — Autenticação

Implementar:

- `POST /auth/register`
- `POST /auth/login`
- Middleware de autenticação JWT.
- Middleware de autorização admin.

Regras:

- Senhas nunca devem retornar na API.
- Senhas devem ser comparadas com bcrypt.
- JWT deve usar `JWT_SECRET` do `.env`.

Critério de aceite:

- Login retorna token.
- Rotas protegidas bloqueiam usuário sem token.
- Rotas admin bloqueiam usuário comum.

---

## Etapa 7 — CRUD de categorias

Endpoints:

```txt
GET /categories
GET /categories/:id
POST /categories
PUT /categories/:id
DELETE /categories/:id
```

Regras:

- Listagem e detalhes são públicos.
- Criar, editar e excluir exigem admin.
- `name` deve ser obrigatório e único.

Critério de aceite:

- CRUD completo funcionando.
- Erros tratados para registros inexistentes e nomes duplicados.

---

## Etapa 8 — CRUD de métodos de preparo

Endpoints:

```txt
GET /brewing-methods
GET /brewing-methods/:id
POST /brewing-methods
PUT /brewing-methods/:id
DELETE /brewing-methods/:id
```

Regras:

- Listagem e detalhes são públicos.
- Criar, editar e excluir exigem admin.
- `name` deve ser obrigatório e único.

Critério de aceite:

- CRUD completo funcionando.
- Erros tratados para registros inexistentes e nomes duplicados.

---

## Etapa 9 — CRUD de cafés

Endpoints:

```txt
GET /coffees
GET /coffees/:id
POST /coffees
PUT /coffees/:id
DELETE /coffees/:id
```

Regras:

- Listagem pública deve exibir apenas cafés ativos.
- Criação, edição e exclusão exigem admin.
- Exclusão deve ser soft delete, alterando `active` para `false`.
- `intensity`, `acidity`, `bitterness` e `sweetness` devem ser valores de 1 a 5.
- `roastLevel` deve aceitar `CLARA`, `MEDIA` ou `ESCURA`.

Critério de aceite:

- CRUD completo funcionando.
- Cafés inativos não aparecem no catálogo público.

---

## Etapa 10 — Catálogo com filtros, paginação e ordenação

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

Ordenação permitida:

```txt
name
price
intensity
createdAt
```

Critério de aceite:

- Filtros podem ser combinados.
- Paginação retorna `page`, `limit`, `total` e `totalPages`.
- Parâmetros inválidos retornam erro 400.

---

## Etapa 11 — Recomendação inteligente

Endpoint:

```txt
POST /recommendations
```

Fluxo:

1. Receber preferências do usuário.
2. Validar dados.
3. Buscar cafés ativos.
4. Enviar preferências e cafés ao serviço Python.
5. Receber ranking de cafés recomendados.
6. Salvar histórico no banco.
7. Retornar resultado ao frontend.

Variável de ambiente:

```txt
ML_SERVICE_URL=http://localhost:8000
```

Fallback obrigatório:

- Se o serviço Python falhar, calcular recomendação local por similaridade.
- A API não deve quebrar por indisponibilidade do serviço Python.

Critério de aceite:

- Endpoint retorna recomendações.
- Cada recomendação contém `score` e `reason`.
- Histórico é salvo em `recommendations`.

---

## Etapa 12 — ChatBot

Endpoint:

```txt
POST /chatbot/message
```

Implementar ChatBot baseado em regras no backend.

Intenções mínimas:

- saudacao
- recomendacao
- torra
- metodo_preparo
- intensidade
- acidez
- amargor
- catalogo
- fallback

Critério de aceite:

- O usuário envia uma mensagem e recebe resposta útil.
- Mensagem e resposta são salvas em `chat_messages`.
- Código do ChatBot fica isolado para futura troca por Rasa, Dialogflow ou OpenAI API.

---

## Etapa 13 — Dashboard administrativo

Endpoint:

```txt
GET /dashboard
```

Dados mínimos:

- Total de cafés cadastrados.
- Total de cafés ativos.
- Total de categorias.
- Total de métodos de preparo.
- Total de recomendações.
- Cafés mais recomendados.
- Últimas recomendações.

Critério de aceite:

- Apenas admin acessa.
- Dados são calculados a partir do banco.

---

## Etapa 14 — Swagger

Endpoint da documentação:

```txt
GET /api-docs
```

Documentar:

- Health
- Auth
- Categories
- Brewing Methods
- Coffees
- Recommendations
- ChatBot
- Dashboard
- Schemas
- Bearer Auth JWT

Critério de aceite:

- Swagger abre no navegador.
- Todas as rotas principais estão documentadas.

---

## Etapa 15 — Testes manuais e revisão

Testar no Swagger, Postman ou Insomnia:

- Health check.
- Registro de usuário.
- Login.
- Proteção de rotas admin.
- CRUD de categorias.
- CRUD de métodos.
- CRUD de cafés.
- Filtros do catálogo.
- Recomendação com serviço Python disponível.
- Recomendação com serviço Python indisponível.
- ChatBot.
- Dashboard.

Critério de aceite:

- Backend roda localmente sem erros.
- Fluxo principal pode ser demonstrado em apresentação.

---

## 7. Definition of Done

Uma tarefa só estará concluída quando:

- O código estiver implementado.
- A validação estiver aplicada.
- Erros estiverem tratados.
- A rota estiver documentada no Swagger.
- O endpoint tiver sido testado manualmente.
- A arquitetura Controller → Service → Repository tiver sido respeitada.
- Não houver credenciais sensíveis no repositório.
- `git status` não mostrar arquivos inesperados.
