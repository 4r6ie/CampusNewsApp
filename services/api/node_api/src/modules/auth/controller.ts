import { Response } from 'express';
import { AuthService } from './service';
import { ok, created } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';
import { verifyRefreshToken } from '../../utils/token';

export async function register(req: AuthRequest, res: Response) {
  const result = await AuthService.register(req.body);
  return created(res, result);
}

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  return ok(res, result);
}

export async function refresh(req: AuthRequest, res: Response) {
  const { refreshToken } = req.body;
  try {
    const payload = verifyRefreshToken(refreshToken);
    const result = await AuthService.refresh(payload.userId);
    return ok(res, result);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
  }
}