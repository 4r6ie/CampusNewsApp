export type UserRole = 'student' | 'faculty' | 'staff' | 'admin' | 'publisher';

export type PostCategory = 'news' | 'event' | 'academic' | 'general';

export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface UserSummary {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
}

export interface PostSummary {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  category: PostCategory;
  publishedAt: string;
  likeCount: number;
  commentCount: number;
}

export interface AnnouncementSummary {
  id: string;
  title: string;
  body: string;
  priority: AnnouncementPriority;
  status: string;
  publishedAt: string | null;
  expiresAt: string | null;
}