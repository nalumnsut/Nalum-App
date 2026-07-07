import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query client — singleton.
 *
 * Config rationale:
 * - staleTime 60s: social feed data doesn't need instant invalidation; avoids
 *   excessive refetches when navigating between tabs.
 * - gcTime 5min: keep inactive queries in cache for fast back-navigation.
 * - retry 2: transient network errors on mobile; don't hammer the server.
 * - refetchOnWindowFocus false: on mobile this fires on app foreground —
 *   handled explicitly per-query instead.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,       // 60 seconds
      gcTime: 1000 * 60 * 5,      // 5 minutes
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
