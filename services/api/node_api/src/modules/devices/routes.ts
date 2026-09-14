import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { registerDevice, removeDevice } from './controller';
import { registerDeviceSchema } from './schema';

export const devicesRouter = Router();

devicesRouter.use(authenticate);

devicesRouter.post('/', validate(registerDeviceSchema), registerDevice);
devicesRouter.delete('/:id', removeDevice);