const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.port, () => {
  console.log(`Grão Prime API running on port ${env.port}`);
});

function shutdown(signal) {
  console.log(`${signal} recebido. Encerrando servidor...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

