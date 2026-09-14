export const config = {
  apiBaseUrl: process.env['API_BASE_URL'] ?? 'http://localhost:3000/api/v1',
  apiTimeoutMs: 30_000,
  paginationDefaults: { page: 1, limit: 20 },
} as const;