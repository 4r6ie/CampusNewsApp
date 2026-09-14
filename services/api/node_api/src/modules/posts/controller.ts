import { Response } from 'express';
import { PostService } from './service';
import { ok, created, noContent } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function listPosts(req: AuthRequest, res: Response) {
  const result = await PostService.list(req.query.page, req.query.limit);
  return ok(res, result.posts, result.meta);
}

export async function getPost(req: AuthRequest, res: Response) {
  const post = await PostService.get(req.params.id);
  return ok(res, post);
}

export async function createPost(req: AuthRequest, res: Response) {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  const post = await PostService.create(req.userId, req.body);
  return created(res, post);
}

export async function updatePost(req: AuthRequest, res: Response) {
  const post = await PostService.update(req.params.id, req.body);
  return ok(res, post);
}

export async function deletePost(req: AuthRequest, res: Response) {
  await PostService.remove(req.params.id);
  return noContent(res);
}