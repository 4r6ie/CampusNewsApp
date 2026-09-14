import { Response } from 'express';
import { ReportService } from './service';
import { ok, created } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function createReport(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  const report = await ReportService.create(req.userId, req.body);
  return created(res, report);
}

export async function resolveReport(req: AuthRequest, res: Response) {
  await ReportService.updateStatus(req.params.id, req.body.status);
  return ok(res, { id: req.params.id, status: req.body.status });
}