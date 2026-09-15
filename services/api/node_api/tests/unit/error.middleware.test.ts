import { Request, Response } from 'express';
import { z } from 'zod';
import { AppError, notFound, errorHandler } from '../../src/middleware/error.middleware';

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as unknown as Response['status'];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
  return res;
}

describe('AppError', () => {
  it('carries the status code and error code', () => {
    const err = new AppError(401, 'INVALID_TOKEN', 'bad token');
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('INVALID_TOKEN');
    expect(err.message).toBe('bad token');
  });
});

describe('notFound', () => {
  it('responds 404 with the route in the message', () => {
    const res = mockResponse();
    notFound({ method: 'GET', path: '/nope' } as Request, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Route GET /nope not found' },
    });
  });
});

describe('errorHandler', () => {
  it('maps AppError to its status code and shape', () => {
    const res = mockResponse();
    errorHandler(new AppError(409, 'CONFLICT', 'duplicate'), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'CONFLICT', message: 'duplicate' },
    });
  });

  it('maps ZodError to 422 with validation details', () => {
    const res = mockResponse();
    const parsed = z.object({ email: z.string().email() }).safeParse({ email: 'nope' });

    errorHandler(parsed.error as unknown as Error, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(422);
    const json = res.json as jest.Mock;
    const payload = json.mock.calls[0][0];
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe('VALIDATION_ERROR');
    expect(payload.error.details).toBeDefined();
  });

  it('maps unexpected errors to 500 without leaking details', () => {
    const res = mockResponse();
    errorHandler(new Error('database password exposed'), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error' },
    });
  });
});