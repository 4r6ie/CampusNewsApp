import { Router } from 'express';
import { authRouter } from '../modules/auth/routes';
import { usersRouter } from '../modules/users/routes';
import { postsRouter } from '../modules/posts/routes';
import { commentsRouter } from '../modules/comments/routes';
import { likesRouter } from '../modules/likes/routes';
import { announcementsRouter } from '../modules/announcements/routes';
import { searchRouter } from '../modules/search/routes';
import { notificationsRouter } from '../modules/notifications/routes';
import { devicesRouter } from '../modules/devices/routes';
import { reportsRouter } from '../modules/reports/routes';
import { adminRouter } from '../modules/admin/routes';

export const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/', likesRouter);
router.use('/', commentsRouter);
router.use('/announcements', announcementsRouter);
router.use('/search', searchRouter);
router.use('/notifications', notificationsRouter);
router.use('/devices', devicesRouter);
router.use('/reports', reportsRouter);
router.use('/admin', adminRouter);