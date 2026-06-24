import { ScrollView, View } from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AppText } from "@/components/ui/app-text";
import { Surface } from "@/components/ui/surface";
import { Colors, MaxContentWidth, Radius, Spacing } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";

function StatusPill({ label, active }: { label: string; active: boolean }) {
  return (
    <View
      style={{
        backgroundColor: active ? Colors.dark.successSurface : Colors.dark.backgroundElement,
        borderColor: active ? Colors.dark.success : Colors.dark.border,
        borderCurve: "continuous",
        borderRadius: Radius.round,
        borderWidth: 1,
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
      }}
    >
      <AppText
        variant="small"
        style={{ color: active ? Colors.dark.success : Colors.dark.textSecondary }}
      >
        {label}
      </AppText>
    </View>
  );
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: Colors.dark.background }}
      contentContainerStyle={{
        alignItems: "center",
        gap: Spacing.five,
        paddingBottom: Spacing.eight + 84,
        paddingHorizontal: Spacing.five,
        paddingTop: Spacing.eight,
      }}
    >
      <View style={{ gap: Spacing.five, maxWidth: MaxContentWidth, width: "100%" }}>
        <Surface
          elevated
          style={{
            backgroundColor: Colors.dark.background,
            gap: Spacing.five,
            padding: Spacing.six,
          }}
        >
          <View style={{ gap: Spacing.three }}>
            <AppText variant="hero">Welcome, {user?.name ?? "Nalum member"}</AppText>
            <AppText selectable variant="body" color="textSecondary">
              {user?.email ?? "Your account workspace is ready."}
            </AppText>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.two }}>
            <StatusPill label={user?.role ?? "member"} active />
            <StatusPill label={user?.email_verified ? "email verified" : "email pending"} active={Boolean(user?.email_verified)} />
            <StatusPill label={user?.profileCompleted ? "profile complete" : "profile pending"} active={Boolean(user?.profileCompleted)} />
            {user?.role === "alumni" ? (
              <StatusPill label={user.verified_alumni ? "alumni verified" : "alumni review"} active={user.verified_alumni} />
            ) : null}
          </View>
        </Surface>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: Spacing.four,
          }}
        >
          {[
            ["Profile", user?.profileCompleted ? "Complete" : "Needs attention"],
            ["Verification", user?.email_verified ? "Active" : "Pending"],
            ["Access", user?.role ? user.role : "Member"],
          ].map(([label, value]) => (
            <Surface key={label} style={{ flexBasis: 220, flexGrow: 1, gap: Spacing.two }}>
              <AppText variant="small" color="textSubtle">
                {label}
              </AppText>
              <AppText selectable variant="section">
                {value}
              </AppText>
            </Surface>
          ))}
        </View>

        <Surface style={{ gap: Spacing.four }}>
          <View style={{ gap: Spacing.two }}>
            <AppText variant="section">Account actions</AppText>
            <AppText variant="body" color="textSecondary">
              Keep account controls close to the dashboard while the rest of the app is built out.
            </AppText>
          </View>
          <AuthButton label="Sign out" variant="secondary" onPress={logout} />
        </Surface>
      </View>
    </ScrollView>
  );
}
