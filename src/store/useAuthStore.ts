import { create } from "zustand";

import { setApiAuthToken } from "@/api";
import {
  apiSignIn,
  apiSignUp,
  apiRefresh,
  apiLogout,
  apiSendOtp,
  apiVerifyOtp,
  apiForgotPassword,
  apiResetPassword,
  apiSendVerificationLink,
  type AuthUser,
} from "@/services/auth";

// ---------------------------------------------------------------------------
// State & action types
// ---------------------------------------------------------------------------

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  /**
   * True during cold-start while we're waiting for the first refresh() call
   * to resolve. The root layout shows a loading spinner in this state so it
   * can avoid a flash of the wrong screen.
   */
  isLoading: boolean;
  /** Email address currently awaiting OTP verification. */
  pendingVerificationEmail: string | null;

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------
  signIn(
    email: string,
    password: string,
  ): Promise<{ error?: string }>;

  signUp(
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<{ error?: string; needsVerification?: boolean }>;

  /**
   * Attempts a silent token refresh using the HTTP-only cookie set by the
   * server. Returns true if the session was successfully restored.
   */
  refresh(): Promise<boolean>;

  logout(): Promise<void>;

  verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ error?: string }>;

  forgotPassword(email: string): Promise<{ error?: string }>;

  resetPassword(
    token: string,
    password: string,
  ): Promise<{ error?: string }>;

  sendOtp(email: string): Promise<{ error?: string }>;

  sendVerificationLink(email: string): Promise<{ error?: string }>;

  /** Internal: sets authenticated state + updates the Authorization header. */
  _setAuth(user: AuthUser, accessToken: string): void;

  /**
   * Internal: clears authenticated state + removes the Authorization header.
   * Called by the 401 interceptor in api/client.ts after a failed refresh.
   */
  _clearAuth(): void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // starts true; cleared after first refresh() settles
  pendingVerificationEmail: null,

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  _setAuth(user, accessToken) {
    setApiAuthToken(accessToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  _clearAuth() {
    setApiAuthToken(); // removes Authorization header
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      pendingVerificationEmail: null,
    });
  },

  // -------------------------------------------------------------------------
  // Auth actions
  // -------------------------------------------------------------------------

  async signIn(email, password) {
    const { data, error } = await apiSignIn(email, password);
    if (error || !data) return { error: error ?? "Sign in failed." };
    get()._setAuth(data.user, data.accessToken);
    return {};
  },

  async signUp(name, email, password, role) {
    const { data, error } = await apiSignUp(name, email, password, role);
    if (error || !data) return { error: error ?? "Sign up failed." };
    set({ pendingVerificationEmail: email });
    return { needsVerification: data.needsVerification };
  },

  async refresh() {
    try {
      const { data, error } = await apiRefresh();
      if (error || !data) {
        set({ isLoading: false });
        return false;
      }
      get()._setAuth(data.user, data.accessToken);
      set({ isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  async logout() {
    await apiLogout(); // best-effort; ignore errors
    get()._clearAuth();
  },

  async verifyOtp(email, otp) {
    const { data, error } = await apiVerifyOtp(email, otp);
    if (error || !data) return { error: error ?? "Verification failed." };
    get()._setAuth(data.user, data.accessToken);
    set({ pendingVerificationEmail: null });
    return {};
  },

  async forgotPassword(email) {
    await apiForgotPassword(email); // always succeeds (anti-enumeration)
    return {};
  },

  async resetPassword(token, password) {
    const { error } = await apiResetPassword(token, password);
    if (error) return { error };
    return {};
  },

  async sendOtp(email) {
    const { error } = await apiSendOtp(email);
    if (error) return { error };
    return {};
  },

  async sendVerificationLink(email) {
    await apiSendVerificationLink(email); // anti-enumeration: always ok
    return {};
  },
}));
