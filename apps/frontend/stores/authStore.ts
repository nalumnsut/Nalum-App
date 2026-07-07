import { create } from 'zustand';
import { tokenStorage } from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  /** Graduation year — displayed in JetBrains Mono per design system */
  graduationYear: number | null;
  /** Department/branch — displayed in JetBrains Mono per design system */
  department: string | null;
  /** College/institution */
  institution: string | null;
  /** Alumni verification status */
  verified: boolean;
};

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

// ─── Store ────────────────────────────────────────────────────────────────────

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;

  setUser: (user: AuthUser) => void;
  setStatus: (status: AuthStatus) => void;
  signOut: () => Promise<void>;
  /**
   * Hydrate from stored token on app launch.
   * Call this in the root layout after fonts load.
   */
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  setUser: (user) => set({ user, status: 'authenticated' }),
  setStatus: (status) => set({ status }),

  signOut: async () => {
    await tokenStorage.clearTokens();
    set({ user: null, status: 'unauthenticated' });
  },

  hydrate: async () => {
    set({ status: 'loading' });
    try {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        set({ status: 'unauthenticated' });
        return;
      }
      // Token exists — validate by fetching /auth/me
      // This is done lazily here; the actual fetch is in the root layout or
      // an AuthGate component to avoid coupling the store to api.ts directly.
      set({ status: 'authenticated' });
    } catch {
      set({ status: 'unauthenticated' });
    }
  },
}));
