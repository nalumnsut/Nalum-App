import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

// ─── Token storage (platform-aware) ──────────────────────────────────────────
//
// Rule: auth tokens go in expo-secure-store (native) or httpOnly cookies (web).
// We NEVER use AsyncStorage or localStorage for tokens.
//
// On web, expo-secure-store falls back to sessionStorage which is NOT httpOnly.
// TODO: Coordinate with backend to implement httpOnly cookie refresh flow for web.
// See instructions/overview.instruction.md Rule #6.

const TOKEN_KEY = 'nalum_access_token';
const REFRESH_KEY = 'nalum_refresh_token';

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      // ⚠️ Temporary: web uses sessionStorage until httpOnly cookie flow is ready.
      // Flag: replace with cookie-based auth before Phase 2 native build.
      return sessionStorage.getItem(TOKEN_KEY);
    }
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  async setAccessToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      sessionStorage.setItem(TOKEN_KEY, token);
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return sessionStorage.getItem(REFRESH_KEY);
    }
    return SecureStore.getItemAsync(REFRESH_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      sessionStorage.setItem(REFRESH_KEY, token);
      return;
    }
    await SecureStore.setItemAsync(REFRESH_KEY, token);
  },

  async clearTokens(): Promise<void> {
    if (Platform.OS === 'web') {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },
};

// ─── Refresh token flow ───────────────────────────────────────────────────────

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  // Deduplicate concurrent refresh attempts
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      await tokenStorage.clearTokens();
      throw new Error('Refresh failed — user must re-authenticate');
    }

    const { accessToken, refreshToken: newRefreshToken } = await res.json();
    await tokenStorage.setAccessToken(accessToken);
    await tokenStorage.setRefreshToken(newRefreshToken);
    return accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

export type ApiRequestInit = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown> | FormData | null;
};

export async function api<T = unknown>(
  path: string,
  init: ApiRequestInit = {},
): Promise<T> {
  const { body, headers: extraHeaders, ...rest } = init;

  const isFormData = body instanceof FormData;
  const accessToken = await tokenStorage.getAccessToken();

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(extraHeaders as Record<string, string>),
  };

  const makeRequest = async (token: string | null) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
    return res;
  };

  let res = await makeRequest(accessToken);

  // Transparent token refresh on 401
  if (res.status === 401) {
    try {
      const freshToken = await refreshAccessToken();
      res = await makeRequest(freshToken);
    } catch {
      // Re-throw so authStore can redirect to login
      throw new Error('UNAUTHENTICATED');
    }
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorBody?.message ?? `API error ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
