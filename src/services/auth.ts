/**
 * Auth API service layer.
 *
 * Every function returns { data, error } — screens never inspect HTTP status
 * codes directly. All requests flow through the single apiClient instance.
 */
import { AxiosError } from "axios";

import { apiClient, type ApiErrorData } from "@/api";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "alumni" | "admin";
  email_verified: boolean;
  profileCompleted: boolean;
  verified_alumni: boolean;
}

export interface AuthSessionResponse {
  user: AuthUser;
  accessToken: string;
}

type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

// ---------------------------------------------------------------------------
// Error mapping
// ---------------------------------------------------------------------------

function mapAuthError(
  error: unknown,
  overrides: Partial<Record<number, string>> = {},
): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const serverMessage = (error.response?.data as ApiErrorData | undefined)
      ?.message;

    if (status !== undefined && overrides[status]) {
      return overrides[status]!;
    }

    switch (status) {
      case 400:
        return serverMessage ?? "Please check your input and try again.";
      case 401:
        return "Invalid email or password.";
      case 403:
        return "Your account has been suspended. Please contact support.";
      case 404:
        return serverMessage ?? "Not found.";
      case 409:
        return "An account with this email already exists. Sign in instead.";
      case 422:
        return "Please check your input and try again.";
      case 429:
        return "Too many attempts. Please wait a moment and try again.";
      case 500:
      case 502:
      case 503:
        return "Server error. Please try again later.";
      default:
        if (!error.response) {
          return "Connection error. Please check your network.";
        }
        return serverMessage ?? "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------

export async function apiSignIn(
  email: string,
  password: string,
): Promise<ApiResult<AuthSessionResponse>> {
  try {
    const { data } = await apiClient.post<AuthSessionResponse>("/auth/login", {
      email,
      password,
    });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: mapAuthError(err) };
  }
}

export async function apiSignUp(
  name: string,
  email: string,
  password: string,
  role: string,
): Promise<ApiResult<{ needsVerification: boolean; email: string }>> {
  try {
    const { data } = await apiClient.post<{
      needsVerification: boolean;
      email: string;
    }>("/auth/register", { name, email, password, role });
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: mapAuthError(err, {
        409: "An account with this email already exists. Sign in instead.",
      }),
    };
  }
}

export async function apiRefresh(): Promise<ApiResult<AuthSessionResponse>> {
  try {
    const { data } =
      await apiClient.post<AuthSessionResponse>("/auth/refresh-token");
    return { data, error: null };
  } catch (err) {
    return { data: null, error: mapAuthError(err) };
  }
}

export async function apiLogout(): Promise<ApiResult<void>> {
  try {
    await apiClient.post("/auth/logout");
    return { data: undefined, error: null };
  } catch (err) {
    // Best-effort logout — clear local state regardless.
    return { data: null, error: mapAuthError(err) };
  }
}

export async function apiSendOtp(
  email: string,
): Promise<ApiResult<{ message: string }>> {
  try {
    const { data } = await apiClient.post<{ message: string }>(
      "/auth/send-otp",
      { email },
    );
    return { data, error: null };
  } catch (err) {
    return { data: null, error: mapAuthError(err) };
  }
}

export async function apiVerifyOtp(
  email: string,
  otp: string,
): Promise<ApiResult<AuthSessionResponse>> {
  try {
    const { data } = await apiClient.post<AuthSessionResponse>(
      "/auth/verify-account-otp",
      { email, otp },
    );
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: mapAuthError(err, {
        400: "Invalid or expired OTP. Please try again.",
        401: "Invalid or expired OTP. Please try again.",
      }),
    };
  }
}

export async function apiForgotPassword(
  email: string,
): Promise<ApiResult<{ message: string }>> {
  try {
    const { data } = await apiClient.post<{ message: string }>(
      "/auth/forgot-password",
      { email },
    );
    return { data, error: null };
  } catch {
    // Always succeed from the caller's perspective (anti-enumeration).
    return { data: { message: "ok" }, error: null };
  }
}

export async function apiResetPassword(
  token: string,
  password: string,
): Promise<ApiResult<{ message: string }>> {
  try {
    const { data } = await apiClient.post<{ message: string }>(
      "/auth/reset-password",
      { token, password },
    );
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: mapAuthError(err, {
        400: "Invalid or expired reset link. Please request a new one.",
        401: "Invalid or expired reset link. Please request a new one.",
      }),
    };
  }
}

export async function apiSendVerificationLink(
  email: string,
): Promise<ApiResult<{ message: string }>> {
  try {
    const { data } = await apiClient.post<{ message: string }>(
      "/auth/resend-verification",
      { email },
    );
    return { data, error: null };
  } catch {
    // Anti-enumeration: always treat as success.
    return { data: { message: "ok" }, error: null };
  }
}
