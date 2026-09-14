import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { listComments, createComment, updateComment, deleteComment } from './controller';
import { createCommentSchema } from './schema';

export const commentsRouter = Router();

commentsRouter.use(authenticate);

commentsRouter.get('/posts/:postId/comments', listComments);
commentsRouter.post('/posts/:postId/comments', validate(createCommentSchema), createComment);
commentsRouter.patch('/comments/:id', validate(createCommentSchema), updateComment);
commentsRouter.delete('/comments/:id', deleteComment);