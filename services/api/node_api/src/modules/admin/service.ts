import { execute, query, RowDataPacket } from '../../database/client';
import { getPagination, paginationMeta } from '../../utils/pagination';
import { AppError } from '../../middleware/error.middleware';
import { AuditService } from '../../services/audit.service';
import type {
  AdminUserRow,
  AdminStats,
  AdminPostRow,
  AdminAnnouncementRow,
  AdminCommentRow,
  AdminReportRow,
  AdminAuditRow,
  AdminOverview,
  OverviewRecentPost,
  OverviewRecentReport,
  OverviewRecentComment,
  OverviewRecentAudit,
  OverviewRecentAnnouncement,
} from './types';

interface StatsRow extends RowDataPacket, AdminStats {}
interface CountRow extends RowDataPacket { total: number }
interface AdminUserRowDb extends RowDataPacket, AdminUserRow {}
interface AdminPostRowDb extends RowDataPacket, AdminPostRow {}
interface AdminAnnouncementRowDb extends RowDataPacket, AdminAnnouncementRow {}
interface AdminCommentRowDb extends RowDataPacket, AdminCommentRow {}
interface AdminReportRowDb extends RowDataPacket, AdminReportRow {}
interface AdminAuditRowDb extends RowDataPacket, AdminAuditRow {}
interface OverviewRecentPostDb extends RowDataPacket, OverviewRecentPost {}
interface OverviewRecentReportDb extends RowDataPacket, OverviewRecentReport {}
interface OverviewRecentCommentDb extends RowDataPacket, OverviewRecentComment {}
interface OverviewRecentAuditDb extends RowDataPacket, OverviewRecentAudit {}
interface OverviewRecentAnnouncementDb extends RowDataPacket, OverviewRecentAnnouncement {}

function searchPattern(raw: unknown): string {
  return typeof raw === 'string' && raw.trim() ? `%${raw.trim()}%` : '';
}

export class AdminService {
  static async stats(): Promise<AdminStats> {
    const rows = await query<StatsRow[]>(
      `SELECT
         (SELECT COUNT(*) FROM users WHERE status != 'deleted') AS users,
         (SELECT COUNT(*) FROM posts WHERE status = 'published') AS posts,
         (SELECT COUNT(*) FROM comments WHERE status = 'visible') AS comments,
         (SELECT COUNT(*) FROM announcements WHERE status = 'published') AS announcements,
         (SELECT COUNT(*) FROM reports WHERE status = 'pending') AS pendingReports,
         (SELECT COUNT(*) FROM audit_logs) AS auditEvents`,
    );
    const s = rows[0];
    return {
      users: Number(s.users),
      posts: Number(s.posts),
      comments: Number(s.comments),
      announcements: Number(s.announcements),
      pendingReports: Number(s.pendingReports),
      auditEvents: Number(s.auditEvents),
    };
  }

  static async overview(): Promise<AdminOverview> {
    const [stats, recentPosts, pendingReports, recentComments, recentAudit, recentAnnouncements] =
      await Promise.all([
        this.stats(),
        query<OverviewRecentPostDb[]>(
          `SELECT p.id, p.title, p.status, p.category, p.published_at AS publishedAt,
                  pr.full_name AS authorName,
                  (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likeCount,
                  (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS commentCount
           FROM posts p
           JOIN profiles pr ON pr.user_id = p.author_id
           WHERE p.status != 'deleted'
           ORDER BY p.updated_at DESC
           LIMIT 5`,
        ),
        query<OverviewRecentReportDb[]>(
          `SELECT r.id, r.target_type AS targetType, r.reason, r.created_at AS createdAt,
                  pr.full_name AS reporterName
           FROM reports r
           JOIN profiles pr ON pr.user_id = r.reporter_id
           WHERE r.status = 'pending'
           ORDER BY r.created_at DESC
           LIMIT 5`,
        ),
        query<OverviewRecentCommentDb[]>(
          `SELECT c.id, c.body, c.status, c.created_at AS createdAt, p.title AS postTitle,
                  pr.full_name AS authorName
           FROM comments c
           JOIN posts p ON p.id = c.post_id
           JOIN profiles pr ON pr.user_id = c.user_id
           WHERE c.status != 'deleted'
           ORDER BY c.created_at DESC
           LIMIT 5`,
        ),
        query<OverviewRecentAuditDb[]>(
          `SELECT a.id, a.action, a.target_type AS targetType, a.created_at AS createdAt,
                  u.email AS actorEmail
           FROM audit_logs a
           LEFT JOIN users u ON u.id = a.actor_id
           ORDER BY a.created_at DESC
           LIMIT 6`,
        ),
        query<OverviewRecentAnnouncementDb[]>(
          `SELECT id, title, priority, status, published_at AS publishedAt
           FROM announcements
           WHERE status != 'deleted'
           ORDER BY created_at DESC
           LIMIT 4`,
        ),
      ]);
    return { stats, recentPosts, pendingReports, recentComments, recentAudit, recentAnnouncements };
  }

  static async listUsers(pageRaw: unknown, limitRaw: unknown, searchRaw: unknown) {
    const { page, limit, offset } = getPagination(pageRaw, limitRaw);
    const search = searchPattern(searchRaw);
    const params: unknown[] = [];
    let where = "u.status != 'deleted'";
    if (search) {
      where += ' AND (u.email LIKE ? OR p.full_name LIKE ?)';
      params.push(search, search);
    }
    const [{ total }] = await query<CountRow[]>(
      `SELECT COUNT(*) AS total FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE ${where}`,
      params as never[],
    );
    const rows = await query<AdminUserRowDb[]>(
      `SELECT u.id, u.email, u.role, u.status, p.full_name AS fullName, p.student_no AS studentNo,
              u.created_at AS createdAt
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE ${where}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset] as never[],
    );
    return { rows, meta: paginationMeta(page, limit, Number(total)) };
  }

  static async setUserStatus(userId: string, status: string, actorId?: string) {
    const result = await execute(
      'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, userId],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    await AuditService.log('user.status.updated', { actorId, targetType: 'user', targetId: userId, metadata: { status } });
  }

  static async listPosts(pageRaw: unknown, limitRaw: unknown, searchRaw: unknown, statusRaw: unknown) {
    const { page, limit, offset } = getPagination(pageRaw, limitRaw);
    const search = searchPattern(searchRaw);
    const status = typeof statusRaw === 'string' && statusRaw ? statusRaw : '';
    const params: unknown[] = [];
    const where = ["p.status != 'deleted'"];
    if (search) {
      where.push('(p.title LIKE ? OR p.body LIKE ?)');
      params.push(search, search);
    }
    if (status) {
      where.push('p.status = ?');
      params.push(status);
    }
    const w = where.join(' AND ');
    const [{ total }] = await query<CountRow[]>(
      `SELECT COUNT(*) AS total FROM posts p WHERE ${w}`,
      params as never[],
    );
    const rows = await query<AdminPostRowDb[]>(
      `SELECT p.id, pr.full_name AS authorName, p.title, p.body, p.category, p.status,
              p.published_at AS publishedAt, p.created_at AS createdAt, p.updated_at AS updatedAt,
              (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likeCount,
              (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS commentCount
       FROM posts p
       JOIN users u ON u.id = p.author_id
       JOIN profiles pr ON pr.user_id = u.id
       WHERE ${w}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset] as never[],
    );
    return { rows, meta: paginationMeta(page, limit, Number(total)) };
  }

  static async setPostStatus(postId: string, status: string, actorId?: string) {
    const result = await execute(
      `UPDATE posts SET status = ?, published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, NOW()) ELSE published_at END,
                                  updated_at = NOW() WHERE id = ?`,
      [status, status, postId],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');
    await AuditService.log('post.status.updated', { actorId, targetType: 'post', targetId: postId, metadata: { status } });
  }

  static async listAnnouncements(pageRaw: unknown, limitRaw: unknown, statusRaw: unknown) {
    const { page, limit, offset } = getPagination(pageRaw, limitRaw);
    const status = typeof statusRaw === 'string' && statusRaw ? statusRaw : '';
    const params: unknown[] = [];
    const where = ["status != 'deleted'"];
    if (status) {
      where.push('status = ?');
      params.push(status);
    }
    const w = where.join(' AND ');
    const [{ total }] = await query<CountRow[]>(
      `SELECT COUNT(*) AS total FROM announcements WHERE ${w}`,
      params as never[],
    );
    const rows = await query<AdminAnnouncementRowDb[]>(
      `SELECT id, title, body, priority, status, published_at AS publishedAt, expires_at AS expiresAt,
              created_at AS createdAt, updated_at AS updatedAt
       FROM announcements
       WHERE ${w}
       ORDER BY FIELD(priority, 'urgent', 'high', 'medium', 'low'), created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset] as never[],
    );
    return { rows, meta: paginationMeta(page, limit, Number(total)) };
  }

  static async setAnnouncementStatus(id: string, status: string, actorId?: string) {
    const result = await execute(
      `UPDATE announcements
       SET status = ?,
           published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, NOW()) ELSE published_at END,
           updated_at = NOW()
       WHERE id = ?`,
      [status, status, id],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'ANNOUNCEMENT_NOT_FOUND', 'Announcement not found');
    await AuditService.log('announcement.status.updated', { actorId, targetType: 'announcement', targetId: id, metadata: { status } });
  }

  static async listComments(pageRaw: unknown, limitRaw: unknown, searchRaw: unknown, statusRaw: unknown) {
    const { page, limit, offset } = getPagination(pageRaw, limitRaw);
    const search = searchPattern(searchRaw);
    const status = typeof statusRaw === 'string' && statusRaw ? statusRaw : '';
    const params: unknown[] = [];
    const where = ["c.status != 'deleted'"];
    if (search) {
      where.push('(c.body LIKE ? OR p.title LIKE ? OR pr.full_name LIKE ?)');
      params.push(search, search, search);
    }
    if (status) {
      where.push('c.status = ?');
      params.push(status);
    }
    const w = where.join(' AND ');
    const [{ total }] = await query<CountRow[]>(
      `SELECT COUNT(*) AS total FROM comments c JOIN posts p ON p.id = c.post_id WHERE ${w}`,
      params as never[],
    );
    const rows = await query<AdminCommentRowDb[]>(
      `SELECT c.id, c.post_id AS postId, p.title AS postTitle, pr.full_name AS authorName,
              c.body, c.status, c.created_at AS createdAt
       FROM comments c
       JOIN posts p ON p.id = c.post_id
       JOIN profiles pr ON pr.user_id = c.user_id
       WHERE ${w}
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset] as never[],
    );
    return { rows, meta: paginationMeta(page, limit, Number(total)) };
  }

  static async setCommentStatus(commentId: string, status: string, actorId?: string) {
    const result = await execute(
      'UPDATE comments SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, commentId],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'COMMENT_NOT_FOUND', 'Comment not found');
    await AuditService.log('comment.status.updated', { actorId, targetType: 'comment', targetId: commentId, metadata: { status } });
  }

  static async listReports(pageRaw: unknown, limitRaw: unknown, statusRaw: unknown, searchRaw: unknown) {
    const { page, limit, offset } = getPagination(pageRaw, limitRaw);
    const status = typeof statusRaw === 'string' && statusRaw ? statusRaw : '';
    const search = searchPattern(searchRaw);
    const params: unknown[] = [];
    const where = ['1 = 1'];
    if (status) {
      where.push('r.status = ?');
      params.push(status);
    }
    if (search) {
      where.push('(r.reason LIKE ? OR pr.full_name LIKE ? OR u.email LIKE ?)');
      params.push(search, search, search);
    }
    const w = where.join(' AND ');
    const [{ total }] = await query<CountRow[]>(
      `SELECT COUNT(*) AS total FROM reports r JOIN users u ON u.id = r.reporter_id WHERE ${w}`,
      params as never[],
    );
    const rows = await query<AdminReportRowDb[]>(
      `SELECT r.id, pr.full_name AS reporterName, u.email AS reporterEmail,
              r.target_type AS targetType, r.target_id AS targetId, r.reason, r.status,
              r.created_at AS createdAt
       FROM reports r
       JOIN users u ON u.id = r.reporter_id
       JOIN profiles pr ON pr.user_id = u.id
       WHERE ${w}
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset] as never[],
    );
    return { rows, meta: paginationMeta(page, limit, Number(total)) };
  }

  static async setReportStatus(reportId: string, status: string, actorId?: string) {
    const result = await execute(
      'UPDATE reports SET status = ? WHERE id = ?',
      [status, reportId],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'REPORT_NOT_FOUND', 'Report not found');
    await AuditService.log('report.status.updated', { actorId, targetType: 'report', targetId: reportId, metadata: { status } });
  }

  static async listAuditLogs(pageRaw: unknown, limitRaw: unknown) {
    const { page, limit, offset } = getPagination(pageRaw, limitRaw);
    const [{ total }] = await query<CountRow[]>(
      'SELECT COUNT(*) AS total FROM audit_logs',
    );
    const rows = await query<AdminAuditRowDb[]>(
      `SELECT a.id, a.actor_id AS actorId, u.email AS actorEmail, a.action,
              a.target_type AS targetType, a.target_id AS targetId, a.metadata_json AS metadataJson,
              a.created_at AS createdAt
       FROM audit_logs a
       LEFT JOIN users u ON u.id = a.actor_id
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return { rows, meta: paginationMeta(page, limit, Number(total)) };
  }
}
