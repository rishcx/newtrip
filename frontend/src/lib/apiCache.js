// Simple in-memory cache to avoid duplicate API calls across page navigations
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const cachedFetch = async (url, options = {}) => {
  const key = url;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();

  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

export const invalidateCache = (url) => {
  if (url) {
    cache.delete(url);
  } else {
    cache.clear();
  }
};
