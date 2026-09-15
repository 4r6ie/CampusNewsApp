import { CacheService } from '../../src/cache/cache.service';
import { redisClient } from '../../src/config/redis';

jest.mock('../../src/config/redis', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  },
}));

const mockGet = redisClient.get as jest.Mock;
const mockSet = redisClient.set as jest.Mock;
const mockDel = redisClient.del as jest.Mock;
const mockKeys = redisClient.keys as jest.Mock;

describe('CacheService', () => {
  const cache = new CacheService('test');

  it('returns null when no value is cached', async () => {
    mockGet.mockResolvedValue(null);

    await expect(cache.get('missing')).resolves.toBeNull();
    expect(mockGet).toHaveBeenCalledWith('test:missing');
  });

  it('parses cached JSON values', async () => {
    mockGet.mockResolvedValue(JSON.stringify({ a: 1 }));

    await expect(cache.get('key')).resolves.toEqual({ a: 1 });
  });

  it('stores values with a TTL in seconds', async () => {
    await cache.set('key', { b: 2 }, 60);

    expect(mockSet).toHaveBeenCalledWith('test:key', JSON.stringify({ b: 2 }), 'EX', 60);
  });

  it('deletes a single key', async () => {
    await cache.del('key');

    expect(mockDel).toHaveBeenCalledWith('test:key');
  });

  it('invalidates all keys matching a pattern', async () => {
    mockKeys.mockResolvedValue(['test:home:a', 'test:home:b']);

    await cache.invalidatePattern('home:*');

    expect(mockDel).toHaveBeenCalledWith('test:home:a', 'test:home:b');
  });

  it('does nothing when no keys match the pattern', async () => {
    mockKeys.mockResolvedValue([]);

    await cache.invalidatePattern('nowhere:*');

    expect(mockDel).not.toHaveBeenCalled();
  });
});