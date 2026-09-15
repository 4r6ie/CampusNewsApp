import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, AuthRequest } from '../../src/middleware/auth.middleware';
import { env } from '../../src/config/env';

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as unknown as Response['status'];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
  return res;
}

describe('authenticate', () => {
  it('rejects requests without a bearer token', () => {
    const res = mockResponse();
    authenticate({ headers: {} } as AuthRequest, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing access token' },
    });
  });

  it('rejects an invalid or expired token', () => {
    const res = mockResponse();
    authenticate(
      { headers: { authorization: 'Bearer not-a-real-token' } } as AuthRequest,
      res,
      jest.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    });
  });

  it('attaches userId and role for a valid token', () => {
    const token = jwt.sign({ userId: 'u1', role: 'admin' }, env.jwtAccessSecret, {
      expiresIn: '1h',
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
    const next = jest.fn();

    authenticate(req, mockResponse(), next);

    expect(req.userId).toBe('u1');
    expect(req.userRole).toBe('admin');
    expect(next).toHaveBeenCalled();
  });
});