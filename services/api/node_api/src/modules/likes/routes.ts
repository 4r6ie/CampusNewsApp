import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { likePost, unlikePost, postLikes } from './controller';

export const likesRouter = Router();

likesRouter.post('/posts/:postId/likes', authenticate, likePost);
likesRouter.delete('/posts/:postId/likes', authenticate, unlikePost);
likesRouter.get('/posts/:postId/likes', authenticate, postLikes);