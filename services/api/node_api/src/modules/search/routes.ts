import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { search } from './controller';

export const searchRouter = Router();

searchRouter.use(authenticate);

searchRouter.get('/', search);