import { Request, Response } from 'express';
import { z } from 'zod';
import { validate, validateQuery } from '../../src/middleware/validation.middleware';

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as unknown as Response['status'];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
  return res;
}

const schema = z.object({ email: z.string().email() });

describe('validate', () => {
  it('passes valid bodies through and replaces req.body with parsed data', () => {
    const req = { body: { email: 'student@campus.edu' } } as Request;
    const next = jest.fn();

    validate(schema)(req, mockResponse(), next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ email: 'student@campus.edu' });
  });

  it('responds 422 with validation details for an invalid body', () => {
    const req = { body: { email: 'not-an-email' } } as Request;
    const res = mockResponse();

    validate(schema)(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(422);
    const json = res.json as jest.Mock;
    expect(json.mock.calls[0][0].error.code).toBe('VALIDATION_ERROR');
  });
});

describe('validateQuery', () => {
  const querySchema = z.object({ page: z.coerce.number().int().positive() });

  it('passes valid query params through', () => {
    const req = { query: { page: '2' } } as unknown as Request;
    const next = jest.fn();

    validateQuery(querySchema)(req, mockResponse(), next);

    expect(next).toHaveBeenCalled();
    expect((req.query as unknown as { page: number }).page).toBe(2);
  });

  it('responds 422 for invalid query params', () => {
    const req = { query: { page: 'bogus' } } as unknown as Request;
    const res = mockResponse();

    validateQuery(querySchema)(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(422);
  });
});