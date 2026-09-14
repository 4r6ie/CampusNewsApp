import { Response } from 'express';
import { UserService } from './service';
import { ok } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  const profile = await UserService.getProfile(req.userId);
  if (!profile) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  return ok(res, profile);
}

export async function updateMe(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  const profile = await UserService.updateProfile(req.userId, req.body);
  return ok(res, profile);
}

export async function getUser(req: AuthRequest, res: Response) {
  const profile = await UserService.getProfile(req.params.id);
  if (!profile) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  return ok(res, profile);
}