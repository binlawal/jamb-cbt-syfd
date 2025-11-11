import { createClient } from 'redis';

// Check if Redis is configured
const redisHost = process.env.REDIS_HOST;
const redisEnabled = redisHost && redisHost.trim() !== '';

const redisUrl = process.env.REDIS_URL || 
  (redisEnabled ? `redis://${redisHost}:${process.env.REDIS_PORT || 6379}` : '');

let redisClient: ReturnType<typeof createClient> | null = null;

if (redisEnabled) {
  redisClient = createClient({
    url: redisUrl,
    password: process.env.REDIS_PASSWORD || undefined,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('Redis reconnection failed after 10 attempts');
          return new Error('Redis reconnection failed');
        }
        return Math.min(retries * 100, 3000);
      },
    },
  });

  // Handle Redis errors
  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis client connected');
  });

  redisClient.on('ready', () => {
    console.log('Redis client ready');
  });

  redisClient.on('reconnecting', () => {
    console.log('Redis client reconnecting');
  });
} else {
  console.log('Redis disabled - running without cache');
}

// Connect to Redis
export async function connectRedis(): Promise<void> {
  if (redisClient && !redisClient.isOpen) {
    await redisClient.connect();
  }
}

// Test Redis connection
export async function testRedisConnection(): Promise<boolean> {
  if (!redisClient) return false;
  try {
    await redisClient.ping();
    return true;
  } catch (error) {
    console.error('Redis connection test failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeRedis(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
}

// In-memory cache fallback when Redis is disabled
const memoryCache = new Map<string, { value: any; expiry?: number }>();

// Cache helpers with fallback to memory
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (redisClient) {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    }
    // Memory fallback
    const cached = memoryCache.get(key);
    if (!cached) return null;
    if (cached.expiry && Date.now() > cached.expiry) {
      memoryCache.delete(key);
      return null;
    }
    return cached.value;
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (redisClient) {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redisClient.setEx(key, ttl, serialized);
      } else {
        await redisClient.set(key, serialized);
      }
    } else {
      // Memory fallback
      memoryCache.set(key, {
        value,
        expiry: ttl ? Date.now() + ttl * 1000 : undefined,
      });
    }
  },

  async del(key: string): Promise<void> {
    if (redisClient) {
      await redisClient.del(key);
    } else {
      memoryCache.delete(key);
    }
  },

  async exists(key: string): Promise<boolean> {
    if (redisClient) {
      const result = await redisClient.exists(key);
      return result === 1;
    }
    return memoryCache.has(key);
  },

  async expire(key: string, ttl: number): Promise<void> {
    if (redisClient) {
      await redisClient.expire(key, ttl);
    } else {
      const cached = memoryCache.get(key);
      if (cached) {
        cached.expiry = Date.now() + ttl * 1000;
      }
    }
  },
};

export { redisClient };
