import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authRateLimit } from '../../middleware/rate-limit.middleware';
import { validate } from '../../middleware/validation.middleware';
import { register, login, refresh, logout } from './controller';
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from './schema';

export const authRouter = Router();

authRouter.post('/register', authRateLimit, validate(registerSchema), register);
authRouter.post('/login', authRateLimit, validate(loginSchema), login);
authRouter.post('/refresh', validate(refreshSchema), refresh);
authRouter.post('/logout', authenticate, validate(logoutSchema), logout);