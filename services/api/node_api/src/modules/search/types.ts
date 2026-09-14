export interface SearchResults {
  posts: Array<{ id: string; title: string; body: string; category: string; publishedAt: Date }>;
  announcements: Array<{ id: string; title: string; body: string; priority: string; publishedAt: Date }>;
}