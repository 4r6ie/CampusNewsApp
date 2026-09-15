import { getPagination, paginationMeta } from '../../src/utils/pagination';

describe('getPagination', () => {
  it('returns sensible defaults when nothing is provided', () => {
    expect(getPagination(undefined, undefined)).toEqual({ page: 1, limit: 20, offset: 0 });
  });

  it('parses page and limit values', () => {
    expect(getPagination(3, 15)).toEqual({ page: 3, limit: 15, offset: 30 });
  });

  it('clamps the limit to a maximum of 100', () => {
    expect(getPagination(1, 500).limit).toBe(100);
  });

  it('enforces a minimum page of 1', () => {
    expect(getPagination(0, 10)).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  it('falls back to defaults for non-numeric input', () => {
    expect(getPagination('abc', 'xyz')).toEqual({ page: 1, limit: 20, offset: 0 });
  });
});

describe('paginationMeta', () => {
  it('computes total pages by ceiling the division', () => {
    expect(paginationMeta(1, 10, 25)).toEqual({ page: 1, limit: 10, total: 25, totalPages: 3 });
  });

  it('reports a single page for totals within the limit', () => {
    expect(paginationMeta(1, 10, 8)).toEqual({ page: 1, limit: 10, total: 8, totalPages: 1 });
  });
});