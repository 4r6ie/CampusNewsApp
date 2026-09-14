export interface AuthResult {
  user: { id: string; email: string; role: string; fullName: string | null };
  accessToken: string;
  refreshToken: string;
}