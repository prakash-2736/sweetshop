/**
 * Cache Abstraction Layer
 * Currently operates in-memory. Can be easily swapped with Redis.
 */
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttlMap = new Map();
  }

  /**
   * Get cached value by key
   */
  async get(key) {
    if (!this.cache.has(key)) return null;

    const expiry = this.ttlMap.get(key);
    if (expiry && Date.now() > expiry) {
      this.del(key);
      return null;
    }

    const value = this.cache.get(key);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  /**
   * Set cache key with value and TTL (in seconds)
   */
  async set(key, value, ttlSeconds = 300) {
    const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
    this.cache.set(key, stringValue);
    
    if (ttlSeconds) {
      this.ttlMap.set(key, Date.now() + ttlSeconds * 1000);
    }
  }

  /**
   * Delete cached key
   */
  async del(key) {
    this.cache.delete(key);
    this.ttlMap.delete(key);
  }

  /**
   * Flush all cache
   */
  async flush() {
    this.cache.clear();
    this.ttlMap.clear();
  }

  /**
   * Generate cache key from query params/arguments
   */
  generateKey(prefix, args = {}) {
    const sortedArgs = Object.keys(args)
      .sort()
      .map(key => `${key}:${JSON.stringify(args[key])}`)
      .join("-");
    return `${prefix}:${sortedArgs}`;
  }
}

module.exports = new CacheManager();
