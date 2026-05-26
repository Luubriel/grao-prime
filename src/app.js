const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const routes = require('./routes');
const swaggerSpec = require('./docs/swagger');
const { notFoundMiddleware, errorMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  return res.status(200).json(swaggerSpec);
});
app.use(routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
