import { useSyncExternalStore } from 'react';
import type { AuthResult, AuthUser } from '../types';

const ACCESS_KEY = 'campus_admin.access';
const REFRESH_KEY = 'campus_admin.refresh';
const USER_KEY = 'campus_admin.user';

export type AuthSession = AuthResult | null;

let session: AuthSession = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function readStoredSession(): AuthSession {
  try {
    const accessToken = localStorage.getItem(ACCESS_KEY);
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!accessToken || !refreshToken) return null;
    const user = JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') as AuthUser | null;
    if (!user) return null;
    return { user, accessToken, refreshToken };
  } catch {
    return null;
  }
}

session = readStoredSession();

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSession(): AuthSession {
  return session;
}

export function setSession(result: AuthResult): void {
  localStorage.setItem(ACCESS_KEY, result.accessToken);
  localStorage.setItem(REFRESH_KEY, result.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(result.user));
  session = result;
  emit();
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  session = null;
  emit();
}

export function getAccessToken(): string {
  return session?.accessToken ?? '';
}

export function getRefreshToken(): string {
  return session?.refreshToken ?? '';
}

export function useAuthSession(): AuthSession {
  return useSyncExternalStore(subscribeAuth, getSession, getSession);
}