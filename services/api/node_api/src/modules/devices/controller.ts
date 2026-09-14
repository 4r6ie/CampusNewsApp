import { Response } from 'express';
import { DeviceService } from './service';
import { ok, noContent } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function registerDevice(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  const device = await DeviceService.register(req.userId, req.body.token, req.body.platform);
  return ok(res, device);
}

export async function removeDevice(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  await DeviceService.remove(req.userId, req.params.id);
  return noContent(res);
}