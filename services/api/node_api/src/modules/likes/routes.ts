import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { likePost, unlikePost, postLikes } from './controller';

export const likesRouter = Router();

likesRouter.use(authenticate);

likesRouter.post('/posts/:postId/likes', likePost);
likesRouter.delete('/posts/:postId/likes', unlikePost);
likesRouter.get('/posts/:postId/likes', postLikes);