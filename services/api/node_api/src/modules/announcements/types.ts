export interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: string;
  publishedAt: Date | null;
  expiresAt: Date | null;
}