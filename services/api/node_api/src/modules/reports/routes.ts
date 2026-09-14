import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createReport, resolveReport } from './controller';
import { createReportSchema } from './schema';

export const reportsRouter = Router();

reportsRouter.use(authenticate);

reportsRouter.post('/', validate(createReportSchema), createReport);
reportsRouter.patch('/:id/status', authorize('admin'), resolveReport);