import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AppText } from "@/components/ui/app-text";
import { Surface } from "@/components/ui/surface";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

/**
 * Forgot password screen.
 *
 * Always shows a generic confirmation after submit to prevent user
 * enumeration — the store's forgotPassword action is already anti-enumeration.
 */
export default function ForgotPasswordScreen() {
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: FormValues) {
    await forgotPassword(values.email);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AuthScreen title="Check your email" subtitle=" ">
        <View style={{ alignItems: "center", gap: Spacing.four }}>
          <Surface
            style={{
              alignItems: "center",
              backgroundColor: Colors.dark.backgroundElement,
              borderRadius: Radius.round,
              height: 64,
              justifyContent: "center",
              padding: 0,
              width: 64,
            }}
          >
            <AppText variant="title" color="primary">
              K
            </AppText>
          </Surface>
          <AppText selectable variant="body" color="textSecondary" style={{ textAlign: "center" }}>
            If an account exists with that email address, you&apos;ll receive a
            password reset link shortly.
          </AppText>
          <AppText variant="small" color="textSubtle" style={{ textAlign: "center" }}>
            Don&apos;t see it? Check your spam folder.
          </AppText>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Email address"
            placeholder="you@example.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.email?.message}
            id="forgot-email"
          />
        )}
      />

      <AuthButton
        label="Send reset link"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        id="forgot-submit"
      />
    </AuthScreen>
  );
}
