import { Response } from 'express';
import { NotificationModule } from './service';
import { ok } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function listNotifications(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  const notifications = await NotificationModule.list(req.userId, req.query.page, req.query.limit);
  return ok(res, notifications);
}

export async function markNotificationRead(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  await NotificationModule.markRead(req.userId, req.params.id, req.body.read);
  return ok(res, { id: req.params.id });
}