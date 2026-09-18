export interface AuthUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type UserStatus = 'active' | 'suspended' | 'deleted';
export type PostStatus = 'draft' | 'published' | 'archived' | 'deleted';
export type AnnouncementStatus = 'draft' | 'published' | 'expired' | 'deleted';
export type CommentStatus = 'visible' | 'hidden' | 'deleted';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type PostCategory = 'news' | 'event' | 'academic' | 'general';
export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AdminStats {
  users: number;
  posts: number;
  comments: number;
  announcements: number;
  pendingReports: number;
  auditEvents: number;
}

export interface OverviewRecentPost {
  id: string;
  title: string;
  status: PostStatus;
  category: PostCategory;
  authorName: string;
  publishedAt: string | null;
  likeCount: number;
  commentCount: number;
}

export interface OverviewRecentReport {
  id: string;
  targetType: string;
  reason: string;
  reporterName: string;
  createdAt: string;
}

export interface OverviewRecentComment {
  id: string;
  body: string;
  status: CommentStatus;
  postTitle: string;
  authorName: string;
  createdAt: string;
}

export interface OverviewRecentAudit {
  id: string;
  action: string;
  targetType: string | null;
  actorEmail: string | null;
  createdAt: string;
}

export interface OverviewRecentAnnouncement {
  id: string;
  title: string;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  publishedAt: string | null;
}

export interface AdminOverview {
  stats: AdminStats;
  recentPosts: OverviewRecentPost[];
  pendingReports: OverviewRecentReport[];
  recentComments: OverviewRecentComment[];
  recentAudit: OverviewRecentAudit[];
  recentAnnouncements: OverviewRecentAnnouncement[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  status: UserStatus;
  createdAt: string;
  fullName: string | null;
  studentNo: string | null;
}

export interface AdminPost {
  id: string;
  authorName: string;
  title: string;
  body: string;
  category: PostCategory;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  body: string;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminComment {
  id: string;
  postId: string;
  postTitle: string;
  authorName: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
}

export interface AdminReport {
  id: string;
  reporterName: string;
  reporterEmail: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

export interface AdminAudit {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadataJson: string | null;
  createdAt: string;
}

export interface ListResult<T> {
  rows: T[];
  meta: PaginationMeta;
}

export interface PostPayload {
  title: string;
  body: string;
  category: PostCategory;
}

export interface AnnouncementPayload {
  title: string;
  body: string;
  priority: AnnouncementPriority;
  expiresAt?: string;
}