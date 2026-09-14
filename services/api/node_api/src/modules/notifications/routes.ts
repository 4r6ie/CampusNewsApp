import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { listNotifications, markNotificationRead } from './controller';
import { markReadSchema } from './schema';

export const notificationsRouter = Router();

notificationsRouter.use(authenticate);

notificationsRouter.get('/', listNotifications);
notificationsRouter.patch('/:id/read', validate(markReadSchema), markNotificationRead);