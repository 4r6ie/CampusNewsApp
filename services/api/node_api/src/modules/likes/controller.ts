import { Response } from 'express';
import { LikeService } from './service';
import { ok } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function likePost(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  const liked = await LikeService.like(req.params.postId, req.userId);
  const count = await LikeService.count(req.params.postId);
  return ok(res, { liked, count });
}

export async function unlikePost(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  await LikeService.unlike(req.params.postId, req.userId);
  const count = await LikeService.count(req.params.postId);
  return ok(res, { liked: false, count });
}

export async function postLikes(req: AuthRequest, res: Response) {
  const count = await LikeService.count(req.params.postId);
  return ok(res, { count });
}