import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { listUsers, updateUserStatus } from './controller';
import { updateUserStatusSchema } from './schema';

export const adminRouter = Router();

adminRouter.use(authenticate, authorize('admin'));

adminRouter.get('/users', listUsers);
adminRouter.patch('/users/:id/status', validate(updateUserStatusSchema), updateUserStatus);

// posts / announcements / comments / reports / notifications routes
// to be composed here as the admin dashboard requirements grow.