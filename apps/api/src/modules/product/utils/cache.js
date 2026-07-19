import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST;

let redisClient = null;
let useRedis = false;

if (redisUrl || redisHost) {
  try {
    const config = redisUrl ? redisUrl : { host: redisHost, port: parseInt(process.env.REDIS_PORT || "6379", 10) };
    redisClient = new Redis(config, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      showFriendlyErrorStack: true,
    });

    redisClient.on("connect", () => {
      console.log("⚡ Redis Cache Connected Successfully.");
      useRedis = true;
    });

    redisClient.on("error", (err) => {
      console.warn("⚠️ Redis connection failed. Falling back to In-Memory Cache.", err.message);
      useRedis = false;
    });
  } catch (err) {
    console.warn("⚠️ Redis initialization error. Using In-Memory Cache.", err.message);
    useRedis = false;
  }
}

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.ttlMap = new Map();
  }

  /**
   * Get cached value by key
   */
  async get(key) {
    if (useRedis && redisClient) {
      try {
        const val = await redisClient.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        console.error("Redis Get Error:", err.message);
      }
    }

    // In-Memory Fallback
    if (!this.memoryCache.has(key)) return null;

    const expiry = this.ttlMap.get(key);
    if (expiry && Date.now() > expiry) {
      this.del(key);
      return null;
    }

    const value = this.memoryCache.get(key);
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

    if (useRedis && redisClient) {
      try {
        if (ttlSeconds) {
          await redisClient.set(key, stringValue, "EX", ttlSeconds);
        } else {
          await redisClient.set(key, stringValue);
        }
        return;
      } catch (err) {
        console.error("Redis Set Error:", err.message);
      }
    }

    // In-Memory Fallback
    this.memoryCache.set(key, stringValue);
    if (ttlSeconds) {
      this.ttlMap.set(key, Date.now() + ttlSeconds * 1000);
    }
  }

  /**
   * Delete cached key
   */
  async del(key) {
    if (useRedis && redisClient) {
      try {
        await redisClient.del(key);
        return;
      } catch (err) {
        console.error("Redis Del Error:", err.message);
      }
    }

    this.memoryCache.delete(key);
    this.ttlMap.delete(key);
  }

  /**
   * Flush all cache
   */
  async flush() {
    if (useRedis && redisClient) {
      try {
        await redisClient.flushall();
        return;
      } catch (err) {
        console.error("Redis Flush Error:", err.message);
      }
    }

    this.memoryCache.clear();
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

export default new CacheManager();
