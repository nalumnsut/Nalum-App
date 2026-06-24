import { zodResolver } from "@hookform/resolvers/zod";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable } from "react-native";
import { z } from "zod";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AuthLinkRow } from "@/components/ui/auth-link-row";
import { AppText } from "@/components/ui/app-text";
import { useAuthStore } from "@/store/useAuthStore";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

/**
 * Sign-in screen.
 * On success the AuthGuard in the root layout redirects to /(tabs).
 */
export default function SignInScreen() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const { error } = await signIn(values.email, values.password);
    if (error) {
      setServerError(error);
    }
    // On success, AuthGuard handles the redirect to /(tabs).
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to your Nalum account"
    >
      <AuthErrorBanner message={serverError} />

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
            id="sign-in-email"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Password"
            placeholder="Your password"
            secureTextEntry
            textContentType="password"
            autoComplete="current-password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.password?.message}
            id="sign-in-password"
          />
        )}
      />

      <Pressable
        onPress={() => router.push("/(auth)/forgot-password" as Href)}
        style={{ alignSelf: "flex-end" }}
        id="sign-in-forgot-link"
      >
        <AppText variant="label" color="primary">
          Forgot password?
        </AppText>
      </Pressable>

      <AuthButton
        label="Sign in"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        id="sign-in-submit"
      />

      <AuthLinkRow
        label="Don't have an account?"
        actionLabel="Sign up"
        onPress={() => router.push("/(auth)/sign-up" as Href)}
        testID="sign-in-signup-link"
      />
    </AuthScreen>
  );
}
