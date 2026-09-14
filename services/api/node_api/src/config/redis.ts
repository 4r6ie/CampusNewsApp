import Redis from 'ioredis';
import { env } from './env';

export const redisClient = new Redis(env.redisUrl, {
  maxRetriesPerRequest: 3,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err.message);
});

redisClient.on('ready', () => {
  console.log('Redis connection established');
});

export default redisClient;