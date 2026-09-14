export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function getPagination(pageRaw: unknown, limitRaw: unknown): PaginationParams {
  const page = Math.max(parseInt(String(pageRaw) || '1', 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(limitRaw) || '20', 10) || 20, 1), 100);
  return { page, limit, offset: (page - 1) * limit };
}

export function paginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}