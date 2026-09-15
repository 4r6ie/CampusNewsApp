import request from 'supertest';
import { app } from '../../src/app';
import { redisClient } from '../../src/config/redis';
import { pool } from '../../src/config/database';

afterAll(async () => {
  await redisClient.quit().catch(() => undefined);
  await pool.end().catch(() => undefined);
});

describe('App integration (no external dependencies)', () => {
  it('GET /health reports the service as ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/definitely-not-a-route');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns 404 for unknown API routes', async () => {
    const res = await request(app).get('/api/v1/nope');

    expect(res.status).toBe(404);
  });

  it('validates the login body before touching services', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('validates the register payload', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'a@b.c', password: 'short' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('protects feed routes behind authentication', async () => {
    const res = await request(app).get('/api/v1/posts');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('protects root-mounted like routes behind authentication', async () => {
    const res = await request(app).get('/api/v1/posts/some-post/likes');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('protects root-mounted comment routes behind authentication', async () => {
    const res = await request(app).post('/api/v1/posts/some-post/comments').send({ body: 'hi' });

    expect(res.status).toBe(401);
  });
});