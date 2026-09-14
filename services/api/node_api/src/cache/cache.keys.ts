export const CacheKeys = {
  feedHome: (userId: string, page: number) => `feed:home:${userId}:${page}`,
  post: (postId: string) => `post:${postId}`,
  search: (query: string) => `search:${query}`,
  rate: (userId: string, endpoint: string) => `rate:${userId}:${endpoint}`,
  notification: (eventId: string) => `notification:${eventId}`,
  session: (sessionId: string) => `session:${sessionId}`,
} as const;