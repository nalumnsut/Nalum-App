import { type Href, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  TextInput,
  View,
} from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AppText } from "@/components/ui/app-text";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

/**
 * OTP verification screen.
 *
 * Shows the email from pendingVerificationEmail in the store.
 * Auto-submits when 6 digits are entered.
 * Resend button has a 60-second cooldown.
 */
export default function OtpVerifyScreen() {
  const router = useRouter();
  const pendingEmail = useAuthStore((s) => s.pendingVerificationEmail);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const sendOtp = useAuthStore((s) => s.sendOtp);

  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRef = useRef<TextInput>(null);

  // Start initial countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === OTP_LENGTH) {
      handleVerify(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  async function handleVerify(code: string) {
    if (!pendingEmail) return;
    setServerError(null);
    setIsVerifying(true);
    const { error } = await verifyOtp(pendingEmail, code);
    setIsVerifying(false);
    if (error) {
      setServerError(error);
      setOtp(""); // clear so user can re-enter
      inputRef.current?.focus();
      return;
    }
    // AuthGuard handles redirect to /(tabs).
  }

  async function handleResend() {
    if (!pendingEmail || countdown > 0) return;
    setIsResending(true);
    await sendOtp(pendingEmail);
    setIsResending(false);
    setCountdown(RESEND_COOLDOWN);
    setOtp("");
  }

  if (!pendingEmail) {
    // Safety net: if we land here without an email, send back to sign-up.
    router.replace("/(auth)/sign-up" as Href);
    return null;
  }

  return (
    <AuthScreen
      title="Verify your email"
      subtitle={`Enter the 6-digit code sent to ${pendingEmail}`}
    >
      <AuthErrorBanner message={serverError} />

      {/* OTP input */}
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={{
          flexDirection: "row",
          gap: Spacing.two,
          justifyContent: "center",
          position: "relative",
        }}
        accessibilityLabel="OTP input"
      >
        {Array.from({ length: OTP_LENGTH }).map((_, i) => {
          const char = otp[i] ?? "";
          const isActive = i === otp.length && otp.length < OTP_LENGTH;
          return (
            <View
              key={i}
              style={[
                {
                  alignItems: "center",
                  backgroundColor: Colors.dark.input,
                  borderCurve: "continuous",
                  borderColor: isActive
                    ? Colors.dark.primary
                    : char
                      ? Colors.dark.borderStrong
                      : Colors.dark.border,
                  borderRadius: Radius.md,
                  borderWidth: isActive ? 2 : 1.5,
                  height: 56,
                  justifyContent: "center",
                  width: 48,
                },
              ]}
            >
              {isVerifying && i === otp.length - 1 ? (
                <ActivityIndicator size="small" color={Colors.dark.primary} />
              ) : (
                <AppText variant="title" style={{ fontSize: 22, lineHeight: 28 }}>
                  {char}
                </AppText>
              )}
            </View>
          );
        })}

        {/* Hidden real input */}
        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={(t) => setOtp(t.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH))}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          autoFocus
          style={{
            caretColor: "transparent",
            height: "100%",
            opacity: 0,
            position: "absolute",
            width: "100%",
          } as object}
          accessibilityLabel="Enter OTP"
          id="otp-input"
        />
      </Pressable>

      <AuthButton
        label="Verify"
        loading={isVerifying}
        onPress={() => handleVerify(otp)}
        disabled={otp.length < OTP_LENGTH}
        id="otp-verify-submit"
      />

      {/* Resend */}
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: Spacing.two,
          justifyContent: "center",
        }}
      >
        <AppText variant="small" color="textSecondary">
          Didn&apos;t receive the code?
        </AppText>
        {countdown > 0 ? (
          <AppText variant="label" color="textSubtle" style={{ fontVariant: ["tabular-nums"] }}>
            Resend in {countdown}s
          </AppText>
        ) : (
          <Pressable
            onPress={handleResend}
            disabled={isResending}
            id="otp-resend"
          >
            <AppText
              variant="label"
              color="primary"
              style={isResending ? { opacity: 0.5 } : undefined}
            >
              {isResending ? "Sending…" : "Resend code"}
            </AppText>
          </Pressable>
        )}
      </View>
    </AuthScreen>
  );
}
