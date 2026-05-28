const crypto = require('crypto');

const env = require('../config/env');

const SAFETY_MARGIN_MS = 30 * 1000;

const cacheState = new Map();

function buildCacheKey(systemInstruction) {
  return crypto.createHash('sha1').update(systemInstruction).digest('hex');
}

async function getOrCreateCache(ai, { kind, model, systemInstruction }) {
  const key = buildCacheKey(systemInstruction);
  const now = Date.now();
  const existing = cacheState.get(kind);

  if (existing && existing.key === key && existing.expiresAt > now + SAFETY_MARGIN_MS) {
    return existing.name;
  }

  try {
    const created = await ai.caches.create({
      model,
      config: {
        displayName: `grao-prime-${kind}`,
        systemInstruction,
        ttl: `${env.gemini.cacheTtlSeconds}s`,
      },
    });

    const expiresAt = created.expireTime
      ? new Date(created.expireTime).getTime()
      : now + env.gemini.cacheTtlSeconds * 1000;

    cacheState.set(kind, { key, name: created.name, expiresAt });

    console.log(`[gemini-cache] kind=${kind} hit=create name=${created.name}`);

    return created.name;
  } catch (error) {
    cacheState.delete(kind);
    console.warn(`[gemini-cache] kind=${kind} create failed: ${error.message}`);

    return null;
  }
}

function clear(kind) {
  if (kind) {
    cacheState.delete(kind);
  } else {
    cacheState.clear();
  }
}

module.exports = {
  getOrCreateCache,
  clear,
};
