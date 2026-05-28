function createRateLimiter({ windowMs, max, keyResolver }) {
  const hits = new Map();

  function cleanup(now) {
    for (const [key, timestamps] of hits) {
      const fresh = timestamps.filter((ts) => now - ts < windowMs);

      if (fresh.length === 0) {
        hits.delete(key);
      } else {
        hits.set(key, fresh);
      }
    }
  }

  return function rateLimit(req, res, next) {
    const key = keyResolver(req);

    if (!key) {
      return next();
    }

    const now = Date.now();

    if (hits.size > 1000) {
      cleanup(now);
    }

    const timestamps = (hits.get(key) || []).filter((ts) => now - ts < windowMs);

    if (timestamps.length >= max) {
      const retryAfterMs = windowMs - (now - timestamps[0]);

      res.setHeader('Retry-After', Math.ceil(retryAfterMs / 1000));

      return res.status(429).json({
        success: false,
        message: 'Muitas requisições. Tente novamente em instantes.',
      });
    }

    timestamps.push(now);
    hits.set(key, timestamps);

    return next();
  };
}

module.exports = {
  createRateLimiter,
};
