import { KeyboardAvoidingView, ScrollView, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Surface } from "@/components/ui/surface";
import { Colors, MaxContentWidth, Radius, Spacing } from "@/constants/theme";

interface AuthScreenProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthScreen({ title, subtitle, children }: AuthScreenProps) {
  return (
    <KeyboardAvoidingView
      behavior={process.env.EXPO_OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: Colors.dark.background }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: Colors.dark.background }}
        contentContainerStyle={{
          alignItems: "center",
          flexGrow: 1,
          justifyContent: "center",
          padding: Spacing.five,
        }}
      >
        <View
          style={{
            gap: Spacing.five,
            maxWidth: MaxContentWidth,
            width: "100%",
          }}
        >
          <View style={{ alignItems: "center", gap: Spacing.three }}>
            <View
              style={{
                alignItems: "center",
                backgroundColor: Colors.dark.primary,
                borderCurve: "continuous",
                borderRadius: Radius.md,
                height: 44,
                justifyContent: "center",
                width: 44,
              }}
            >
              <AppText variant="section" color="inverseText">
                N
              </AppText>
            </View>
            <View style={{ alignItems: "center", gap: Spacing.one }}>
              <AppText variant="hero" style={{ textAlign: "center" }}>
                Nalum
              </AppText>
              <AppText variant="small" color="textSubtle" style={{ textAlign: "center" }}>
                Alumni network access
              </AppText>
            </View>
          </View>

          <Surface
            elevated
            style={{
              alignSelf: "center",
              gap: Spacing.five,
              maxWidth: 460,
              padding: Spacing.six,
              width: "100%",
            }}
          >
            <View style={{ gap: Spacing.two }}>
              <AppText variant="title">{title}</AppText>
              {subtitle ? (
                <AppText variant="body" color="textSecondary">
                  {subtitle}
                </AppText>
              ) : null}
            </View>

            <View style={{ gap: Spacing.four }}>{children}</View>
          </Surface>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
