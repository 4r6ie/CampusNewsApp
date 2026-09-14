export interface AuthResult {
  user: { id: string; email: string; role: string };
  accessToken: string;
  refreshToken: string;
}