import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { listPosts, getPost, createPost, updatePost, deletePost } from './controller';
import { createPostSchema, updatePostSchema } from './schema';

export const postsRouter = Router();

postsRouter.use(authenticate);

postsRouter.get('/', listPosts);
postsRouter.get('/:id', getPost);
postsRouter.post('/', authorize('admin', 'publisher'), validate(createPostSchema), createPost);
postsRouter.patch('/:id', validate(updatePostSchema), updatePost);
postsRouter.delete('/:id', deletePost);

export { AuthRequest };