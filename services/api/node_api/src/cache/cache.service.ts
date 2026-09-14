import { redisClient } from '../config/redis';

export class CacheService {
  private baseKey: string;

  constructor(baseKey: string) {
    this.baseKey = baseKey;
  }

  private fullKey(key: string): string {
    return `${this.baseKey}:${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(this.fullKey(key));
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    await redisClient.set(this.fullKey(key), JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await redisClient.del(this.fullKey(key));
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redisClient.keys(`${this.baseKey}:${pattern}`);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  }
}

export const feedCache = new CacheService('feed');
export const postCache = new CacheService('post');
export const searchCache = new CacheService('search');