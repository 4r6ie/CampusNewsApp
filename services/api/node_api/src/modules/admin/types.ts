export interface AdminUserSummary {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

export interface AdminUserRow extends AdminUserSummary {
  fullName: string | null;
  studentNo: string | null;
}

export interface AdminStats {
  users: number;
  posts: number;
  comments: number;
  announcements: number;
  pendingReports: number;
  auditEvents: number;
}

export interface AdminPostRow {
  id: string;
  authorName: string;
  title: string;
  body: string;
  category: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  commentCount: number;
}

export interface AdminAnnouncementRow {
  id: string;
  title: string;
  body: string;
  priority: string;
  status: string;
  publishedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminCommentRow {
  id: string;
  postId: string;
  postTitle: string;
  authorName: string;
  body: string;
  status: string;
  createdAt: Date;
}

export interface AdminReportRow {
  id: string;
  reporterName: string;
  reporterEmail: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  createdAt: Date;
}

export interface AdminAuditRow {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadataJson: string | null;
  createdAt: Date;
}