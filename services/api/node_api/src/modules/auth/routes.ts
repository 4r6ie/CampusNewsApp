import { Router } from 'express';
import { authRateLimit } from '../../middleware/rate-limit.middleware';
import { validate } from '../../middleware/validation.middleware';
import { register, login, refresh } from './controller';
import { registerSchema, loginSchema, refreshSchema } from './schema';

export const authRouter = Router();

authRouter.post('/register', authRateLimit, validate(registerSchema), register);
authRouter.post('/login', authRateLimit, validate(loginSchema), login);
authRouter.post('/refresh', validate(refreshSchema), refresh);
authRouter.post('/logout', (_req, res) => {
  // Client discards tokens; server-side revocation can be added via Redis session store.
  res.status(204).send();
});