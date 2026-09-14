import { Response } from 'express';
import { AnnouncementService } from './service';
import { ok, created, noContent } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function listAnnouncements(req: AuthRequest, res: Response) {
  const announcements = await AnnouncementService.list(req.query.page, req.query.limit);
  return ok(res, announcements);
}

export async function getAnnouncement(req: AuthRequest, res: Response) {
  const announcement = await AnnouncementService.get(req.params.id);
  return ok(res, announcement);
}

export async function createAnnouncement(req: AuthRequest, res: Response) {
  const announcement = await AnnouncementService.create(req.body);
  return created(res, announcement);
}

export async function updateAnnouncement(req: AuthRequest, res: Response) {
  const announcement = await AnnouncementService.update(req.params.id, req.body);
  return ok(res, announcement);
}

export async function deleteAnnouncement(req: AuthRequest, res: Response) {
  await AnnouncementService.remove(req.params.id);
  return noContent(res);
}