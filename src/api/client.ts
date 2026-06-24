import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

/**
 * Extends InternalAxiosRequestConfig with a retry flag to prevent
 * infinite 401 loops in the refresh interceptor.
 *
 * NOTE: Native cookie-jar handling is intentionally omitted here — this is
 * web-only (withCredentials). See AGENTS.md for context on future native work.
 */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not defined");
}

export type ApiErrorData = {
  message?: string;
  code?: string;
  errors?: unknown;
};

// eslint-disable-next-line import/no-named-as-default-member -- axios.create() on the default export is correct usage per axios docs.
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const setApiAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorData>) => {
    const originalConfig = error.config as RetryableRequestConfig | undefined;

    // Only intercept 401s on requests that haven't already been retried.
    if (error.response?.status === 401 && originalConfig && !originalConfig._isRetry) {
      originalConfig._isRetry = true;

      try {
        // Lazy import to avoid circular dependency at module load time.
        const { useAuthStore } = await import("@/store/useAuthStore");
        const store = useAuthStore.getState();
        const refreshed = await store.refresh();

        if (refreshed) {
          // refresh() already calls setApiAuthToken internally via _setAuth.
          return apiClient(originalConfig);
        }
        // Refresh failed — clear auth and let the error propagate.
        store._clearAuth();
      } catch {
        // Refresh itself threw — ensure auth is cleared.
        try {
          const { useAuthStore } = await import("@/store/useAuthStore");
          useAuthStore.getState()._clearAuth();
        } catch {
          // Nothing more we can do.
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
