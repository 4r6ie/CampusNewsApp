import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { getMe, updateMe, getUser } from './controller';
import { updateProfileSchema } from './schema';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', getMe);
usersRouter.patch('/me', validate(updateProfileSchema), updateMe);
usersRouter.get('/:id', getUser);