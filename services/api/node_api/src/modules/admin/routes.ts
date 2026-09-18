import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate, validateQuery } from '../../middleware/validation.middleware';
import {
  getStats,
  getOverview,
  listUsers,
  updateUserStatus,
  listPosts,
  updatePostStatus,
  listAnnouncements,
  updateAnnouncementStatus,
  listComments,
  updateCommentStatus,
  listReports,
  updateReportStatus,
  listAuditLogs,
} from './controller';
import {
  adminListQuerySchema,
  updateAnnouncementStatusSchema,
  updateCommentStatusSchema,
  updatePostStatusSchema,
  updateReportStatusSchema,
  updateUserStatusSchema,
} from './schema';

export const adminRouter = Router();

adminRouter.use(authenticate, authorize('admin'));

adminRouter.get('/stats', getStats);
adminRouter.get('/overview', getOverview);

adminRouter.get('/users', validateQuery(adminListQuerySchema), listUsers);
adminRouter.patch('/users/:id/status', validate(updateUserStatusSchema), updateUserStatus);

adminRouter.get('/posts', validateQuery(adminListQuerySchema), listPosts);
adminRouter.patch('/posts/:id/status', validate(updatePostStatusSchema), updatePostStatus);

adminRouter.get('/announcements', validateQuery(adminListQuerySchema), listAnnouncements);
adminRouter.patch('/announcements/:id/status', validate(updateAnnouncementStatusSchema), updateAnnouncementStatus);

adminRouter.get('/comments', validateQuery(adminListQuerySchema), listComments);
adminRouter.patch('/comments/:id/status', validate(updateCommentStatusSchema), updateCommentStatus);

adminRouter.get('/reports', validateQuery(adminListQuerySchema), listReports);
adminRouter.patch('/reports/:id/status', validate(updateReportStatusSchema), updateReportStatus);

adminRouter.get('/audit-logs', validateQuery(adminListQuerySchema), listAuditLogs);