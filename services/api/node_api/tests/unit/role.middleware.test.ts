import { Response } from 'express';
import { authorize } from '../../src/middleware/role.middleware';
import { AuthRequest } from '../../src/middleware/auth.middleware';

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as unknown as Response['status'];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
  return res;
}

describe('authorize', () => {
  it('allows a request with a matching role', () => {
    const req = { userRole: 'admin' } as AuthRequest;
    const next = jest.fn();

    authorize('admin', 'publisher')(req, mockResponse(), next);

    expect(next).toHaveBeenCalled();
  });

  it('rejects a role that is not allowed', () => {
    const req = { userRole: 'student' } as AuthRequest;
    const res = mockResponse();

    authorize('admin')(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
    });
  });

  it('rejects requests with no role attached', () => {
    const req = {} as AuthRequest;
    const res = mockResponse();

    authorize('admin')(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
  });
});