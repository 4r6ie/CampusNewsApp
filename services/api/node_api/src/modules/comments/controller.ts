import { Response } from 'express';
import { CommentService } from './service';
import { ok, created, noContent } from '../../utils/response';
import { getPagination } from '../../utils/pagination';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function listComments(req: AuthRequest, res: Response) {
  const { offset, limit } = getPagination(req.query.page, req.query.limit);
  const comments = await CommentService.list(req.params.postId, offset, limit);
  return ok(res, comments);
}

export async function createComment(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  const comment = await CommentService.create(req.params.postId, req.userId, req.body.body);
  return created(res, comment);
}

export async function updateComment(req: AuthRequest, res: Response) {
  if (!req.userId || !req.userRole) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  await CommentService.update(req.params.id, req.userId, req.userRole, req.body.body);
  return ok(res, { id: req.params.id });
}

export async function deleteComment(req: AuthRequest, res: Response) {
  if (!req.userId || !req.userRole) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  await CommentService.remove(req.params.id, req.userId, req.userRole);
  return noContent(res);
}