import jwt from 'jsonwebtoken';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../src/utils/token';
import { env } from '../../src/config/env';

describe('token utils', () => {
  it('signs an access token carrying the user id and role', () => {
    const token = signAccessToken('user-1', 'student');
    const decoded = jwt.verify(token, env.jwtAccessSecret) as {
      userId: string;
      role: string;
    };
    expect(decoded.userId).toBe('user-1');
    expect(decoded.role).toBe('student');
  });

  it('signs and verifies a refresh token with a jti', () => {
    const token = signRefreshToken('user-1', 'jti-1');
    const decoded = verifyRefreshToken(token);
    expect(decoded.userId).toBe('user-1');
    expect(decoded.jti).toBe('jti-1');
  });

  it('throws on a tampered refresh token', () => {
    expect(() => verifyRefreshToken('not-a-jwt')).toThrow();
  });
});