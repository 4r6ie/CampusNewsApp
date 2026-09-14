import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { listAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement } from './controller';
import { createAnnouncementSchema } from './schema';

export const announcementsRouter = Router();

announcementsRouter.use(authenticate);

announcementsRouter.get('/', listAnnouncements);
announcementsRouter.get('/:id', getAnnouncement);
announcementsRouter.post('/', authorize('admin', 'publisher'), validate(createAnnouncementSchema), createAnnouncement);
announcementsRouter.patch('/:id', authorize('admin', 'publisher'), updateAnnouncement);
announcementsRouter.delete('/:id', authorize('admin'), deleteAnnouncement);