require('dotenv').config({ quiet: true });

const geminiTimeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || 15000);
const geminiCacheTtlSeconds = Number(process.env.GEMINI_CACHE_TTL_SECONDS || 3600);

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3001),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || null,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    timeoutMs: Number.isFinite(geminiTimeoutMs) && geminiTimeoutMs > 0 ? geminiTimeoutMs : 15000,
    cacheTtlSeconds:
      Number.isFinite(geminiCacheTtlSeconds) && geminiCacheTtlSeconds >= 60
        ? geminiCacheTtlSeconds
        : 3600,
    cacheEnabled: process.env.GEMINI_CACHE_ENABLED !== 'false',
    enabled: process.env.GEMINI_ENABLED !== 'false',
  },
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || 'grao_prime',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
  },
};

module.exports = env;
