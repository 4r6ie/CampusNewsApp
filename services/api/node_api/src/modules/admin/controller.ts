import { Response } from 'express';
import { AdminService } from './service';
import { ok } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function listUsers(req: AuthRequest, res: Response) {
  const users = await AdminService.listUsers(req.query.page, req.query.limit);
  return ok(res, users);
}

export async function updateUserStatus(req: AuthRequest, res: Response) {
  await AdminService.setUserStatus(req.params.id, req.body.status, req.userId);
  return ok(res, { id: req.params.id, status: req.body.status });
}