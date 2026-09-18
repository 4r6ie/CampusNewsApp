import { Response } from 'express';
import { AdminService } from './service';
import { ok } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function getStats(req: AuthRequest, res: Response) {
  const stats = await AdminService.stats();
  return ok(res, stats);
}

export async function getOverview(req: AuthRequest, res: Response) {
  const overview = await AdminService.overview();
  return ok(res, overview);
}

export async function listUsers(req: AuthRequest, res: Response) {
  const { rows, meta } = await AdminService.listUsers(req.query.page, req.query.limit, req.query.search);
  return ok(res, rows, meta);
}

export async function updateUserStatus(req: AuthRequest, res: Response) {
  await AdminService.setUserStatus(req.params.id, req.body.status, req.userId);
  return ok(res, { id: req.params.id, status: req.body.status });
}

export async function listPosts(req: AuthRequest, res: Response) {
  const { rows, meta } = await AdminService.listPosts(
    req.query.page,
    req.query.limit,
    req.query.search,
    req.query.status,
  );
  return ok(res, rows, meta);
}

export async function updatePostStatus(req: AuthRequest, res: Response) {
  await AdminService.setPostStatus(req.params.id, req.body.status, req.userId);
  return ok(res, { id: req.params.id, status: req.body.status });
}

export async function listAnnouncements(req: AuthRequest, res: Response) {
  const { rows, meta } = await AdminService.listAnnouncements(
    req.query.page,
    req.query.limit,
    req.query.status,
  );
  return ok(res, rows, meta);
}

export async function updateAnnouncementStatus(req: AuthRequest, res: Response) {
  await AdminService.setAnnouncementStatus(req.params.id, req.body.status, req.userId);
  return ok(res, { id: req.params.id, status: req.body.status });
}

export async function listComments(req: AuthRequest, res: Response) {
  const { rows, meta } = await AdminService.listComments(
    req.query.page,
    req.query.limit,
    req.query.search,
    req.query.status,
  );
  return ok(res, rows, meta);
}

export async function updateCommentStatus(req: AuthRequest, res: Response) {
  await AdminService.setCommentStatus(req.params.id, req.body.status, req.userId);
  return ok(res, { id: req.params.id, status: req.body.status });
}

export async function listReports(req: AuthRequest, res: Response) {
  const { rows, meta } = await AdminService.listReports(
    req.query.page,
    req.query.limit,
    req.query.status,
    req.query.search,
  );
  return ok(res, rows, meta);
}

export async function updateReportStatus(req: AuthRequest, res: Response) {
  await AdminService.setReportStatus(req.params.id, req.body.status, req.userId);
  return ok(res, { id: req.params.id, status: req.body.status });
}

export async function listAuditLogs(req: AuthRequest, res: Response) {
  const { rows, meta } = await AdminService.listAuditLogs(req.query.page, req.query.limit);
  return ok(res, rows, meta);
}

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  return ok(res, { userId: req.userId, role: req.userRole });
}