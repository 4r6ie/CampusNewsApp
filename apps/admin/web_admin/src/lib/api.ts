import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { clearSession, getAccessToken, getRefreshToken, setSession } from './auth';
import type { AuthResult } from '../types';

export const api = axios.create({
  baseURL: '/api/v1',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<AuthResult> | null = null;

async function refreshAccessToken(): Promise<AuthResult> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('Missing refresh token');
  const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken });
  return data.data as AuthResult;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    if (error.response?.status === 401 && original && !original._retry && getRefreshToken()) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken()
            .then((result) => {
              setSession(result);
              return result;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }
        const result = await refreshPromise;
        original.headers.Authorization = `Bearer ${result.accessToken}`;
        return api(original);
      } catch {
        clearSession();
        throw error;
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError<{ error?: { message?: string } }>(error)) {
    const message = error.response?.data?.error?.message;
    if (message) return message;
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      return 'Cannot reach the server';
    }
    if (error.response) return `Request failed (${error.response.status})`;
  }
  return fallback;
}