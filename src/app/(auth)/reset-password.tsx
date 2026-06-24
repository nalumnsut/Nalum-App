import { zodResolver } from "@hookform/resolvers/zod";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AppText } from "@/components/ui/app-text";
import { Surface } from "@/components/ui/surface";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password is too long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

/**
 * Reset password screen.
 *
 * Reads `token` from the `?token=` query parameter via useLocalSearchParams.
 * Shows an error state if no token is present.
 * On success, redirects to sign-in.
 *
 * getResetTokenFromEntry() isolation: useLocalSearchParams is called here in
 * the screen component. If native deep-link parsing ever differs, only this
 * file needs updating. See AGENTS.md for context.
 */
export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Invalid / missing token
  if (!token) {
    return (
      <AuthScreen title="Invalid link" subtitle=" ">
        <View style={{ alignItems: "center", gap: Spacing.four }}>
          <Surface
            style={{
              alignItems: "center",
              backgroundColor: Colors.dark.errorSurface,
              borderColor: Colors.dark.error,
              borderRadius: Radius.round,
              height: 64,
              justifyContent: "center",
              padding: 0,
              width: 64,
            }}
          >
            <AppText variant="title" color="error">
              !
            </AppText>
          </Surface>
          <AppText selectable variant="body" color="textSecondary" style={{ textAlign: "center" }}>
            This password reset link is invalid or has expired. Please request a
            new one.
          </AppText>
        </View>
        <AuthButton
          label="Request new link"
          onPress={() => router.replace("/(auth)/forgot-password" as Href)}
          id="reset-request-new"
        />
      </AuthScreen>
    );
  }

  if (success) {
    return (
      <AuthScreen title="Password updated" subtitle=" ">
        <View style={{ alignItems: "center", gap: Spacing.four }}>
          <Surface
            style={{
              alignItems: "center",
              backgroundColor: Colors.dark.successSurface,
              borderColor: Colors.dark.success,
              borderRadius: Radius.round,
              height: 64,
              justifyContent: "center",
              padding: 0,
              width: 64,
            }}
          >
            <AppText variant="title" style={{ color: Colors.dark.success }}>
              ✓
            </AppText>
          </Surface>
          <AppText selectable variant="body" color="textSecondary" style={{ textAlign: "center" }}>
            Your password has been updated successfully. You can now sign in with
            your new password.
          </AppText>
        </View>
        <AuthButton
          label="Sign in"
          onPress={() => router.replace("/(auth)/sign-in" as Href)}
          id="reset-success-signin"
        />
      </AuthScreen>
    );
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const { error } = await resetPassword(token!, values.password);
    if (error) {
      setServerError(error);
      return;
    }
    setSuccess(true);
  }

  return (
    <AuthScreen
      title="Set new password"
      subtitle="Choose a strong password for your account."
    >
      <AuthErrorBanner message={serverError} />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="New password"
            placeholder="At least 8 characters"
            secureTextEntry
            textContentType="newPassword"
            autoComplete="new-password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.password?.message}
            id="reset-password"
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Confirm password"
            placeholder="Repeat your new password"
            secureTextEntry
            textContentType="newPassword"
            autoComplete="new-password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.confirmPassword?.message}
            id="reset-confirm-password"
          />
        )}
      />

      <AuthButton
        label="Update password"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        id="reset-submit"
      />
    </AuthScreen>
  );
}
