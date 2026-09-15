import { Response } from 'express';
import { ok, created, noContent } from '../../src/utils/response';

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as unknown as Response['status'];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
  res.send = jest.fn().mockReturnValue(res) as unknown as Response['send'];
  return res;
}

describe('response helpers', () => {
  it('ok returns 200 with success and data', () => {
    const res = mockResponse();
    ok(res, { id: 1 });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1 } });
  });

  it('ok includes meta when provided', () => {
    const res = mockResponse();
    ok(res, [], { page: 1 });

    expect(res.json).toHaveBeenCalledWith({ success: true, data: [], meta: { page: 1 } });
  });

  it('created returns 201', () => {
    const res = mockResponse();
    created(res, { id: 2 });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 2 } });
  });

  it('noContent returns 204 and sends an empty body', () => {
    const res = mockResponse();
    noContent(res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});