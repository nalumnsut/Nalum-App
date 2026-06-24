import { zodResolver } from "@hookform/resolvers/zod";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { z } from "zod";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AuthLinkRow } from "@/components/ui/auth-link-row";
import { AppText } from "@/components/ui/app-text";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const NSUT_DOMAIN = "@nsut.ac.in";

const schema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(80, "Name is too long."),
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password is too long."),
    role: z.union([z.literal("student"), z.literal("alumni")], {
      error: "Please select a role.",
    }),
  })
  .refine(
    (data) => {
      if (data.role === "student") {
        return data.email.endsWith(NSUT_DOMAIN);
      }
      return true;
    },
    {
      message: `Student accounts require an ${NSUT_DOMAIN} email address.`,
      path: ["email"],
    },
  );

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Role selector
// ---------------------------------------------------------------------------

interface RoleSelectorProps {
  value: "student" | "alumni";
  onChange: (role: "student" | "alumni") => void;
  error?: string;
}

function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  const roles: { key: "student" | "alumni"; label: string }[] = [
    { key: "student", label: "Student" },
    { key: "alumni", label: "Alumni" },
  ];

  return (
    <View style={{ gap: Spacing.two }}>
      <AppText variant="label" color="textSecondary">
        I am a
      </AppText>
      <View
        style={{
          backgroundColor: Colors.dark.input,
          borderColor: error ? Colors.dark.error : Colors.dark.border,
          borderCurve: "continuous",
          borderRadius: Radius.md,
          borderWidth: 1,
          flexDirection: "row",
          gap: Spacing.two,
          padding: Spacing.one,
        }}
      >
        {roles.map((role) => {
          const isSelected = value === role.key;
          return (
            <Pressable
              key={role.key}
              onPress={() => onChange(role.key)}
              style={[
                {
                  alignItems: "center",
                  borderCurve: "continuous",
                  borderRadius: Radius.sm,
                  flex: 1,
                  justifyContent: "center",
                  minHeight: 44,
                },
                isSelected && { backgroundColor: Colors.dark.primary },
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              id={`sign-up-role-${role.key}`}
            >
              <AppText
                variant="label"
                color={isSelected ? "inverseText" : "textSecondary"}
              >
                {role.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <AppText selectable variant="small" color="error">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

/**
 * Sign-up screen.
 *
 * Student emails must end with @nsut.ac.in (validated via zod refine).
 * On success with needsVerification, stores the email in the auth store and
 * navigates to the OTP verify screen.
 */
export default function SignUpScreen() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", role: "student" },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const result = await signUp(
      values.name,
      values.email,
      values.password,
      values.role,
    );

    if (result.error) {
      setServerError(result.error);
      return;
    }

    if (result.needsVerification) {
      router.push("/(auth)/otp-verify" as Href);
    } else {
      // Already verified (e.g. alumni with pre-verified email)
      router.replace("/(tabs)" as Href);
    }
  }

  return (
    <AuthScreen
      title="Create account"
      subtitle="Join the Nalum alumni network"
    >
      <AuthErrorBanner message={serverError} />

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Full name"
            placeholder="Your full name"
            textContentType="name"
            autoComplete="name"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.name?.message}
            id="sign-up-name"
          />
        )}
      />

      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, value } }) => (
          <RoleSelector
            value={value}
            onChange={onChange}
            error={errors.role?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Email address"
            placeholder="you@nsut.ac.in"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.email?.message}
            id="sign-up-email"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Password"
            placeholder="At least 8 characters"
            secureTextEntry
            textContentType="newPassword"
            autoComplete="new-password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.password?.message}
            id="sign-up-password"
          />
        )}
      />

      <AuthButton
        label="Create account"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        id="sign-up-submit"
      />

      <AuthLinkRow
        label="Already have an account?"
        actionLabel="Sign in"
        onPress={() => router.replace("/(auth)/sign-in" as Href)}
        testID="sign-up-signin-link"
      />
    </AuthScreen>
  );
}
