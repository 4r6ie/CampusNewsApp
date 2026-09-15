import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { listComments, createComment, updateComment, deleteComment } from './controller';
import { createCommentSchema } from './schema';

export const commentsRouter = Router();

commentsRouter.get('/posts/:postId/comments', authenticate, listComments);
commentsRouter.post('/posts/:postId/comments', authenticate, validate(createCommentSchema), createComment);
commentsRouter.patch('/comments/:id', authenticate, validate(createCommentSchema), updateComment);
commentsRouter.delete('/comments/:id', authenticate, deleteComment);