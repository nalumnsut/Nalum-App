import { useState } from "react";
import { View } from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AppText } from "@/components/ui/app-text";
import { Surface } from "@/components/ui/surface";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Email verification pending screen (fallback for email-link flow).
 *
 * Shows the same UI regardless of whether the email existed (anti-enumeration).
 * Provides a resend button which calls sendVerificationLink silently.
 */
export default function VerifyPendingScreen() {
  const pendingEmail = useAuthStore((s) => s.pendingVerificationEmail);
  const sendVerificationLink = useAuthStore((s) => s.sendVerificationLink);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleResend() {
    if (!pendingEmail) return;
    setIsSending(true);
    await sendVerificationLink(pendingEmail);
    setIsSending(false);
    setSent(true);
  }

  return (
    <AuthScreen
      title="Check your email"
      subtitle="We've sent a verification link to your inbox."
    >
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
            @
          </AppText>
        </Surface>
        <AppText selectable variant="body" color="textSecondary" style={{ textAlign: "center" }}>
          Click the link in the email to verify your account. If you don&apos;t see
          it, check your spam folder.
        </AppText>
      </View>

      {sent ? (
        <View
          style={{
            backgroundColor: Colors.dark.successSurface,
            borderColor: Colors.dark.success,
            borderCurve: "continuous",
            borderRadius: Radius.md,
            borderWidth: 1,
            paddingHorizontal: Spacing.four,
            paddingVertical: Spacing.three,
          }}
        >
          <AppText selectable variant="label" style={{ color: Colors.dark.success }}>
            Verification link resent. Check your inbox.
          </AppText>
        </View>
      ) : (
        <AuthButton
          label={isSending ? "Sending…" : "Resend verification link"}
          loading={isSending}
          variant="ghost"
          onPress={handleResend}
          disabled={!pendingEmail}
          id="verify-pending-resend"
        />
      )}
    </AuthScreen>
  );
}
