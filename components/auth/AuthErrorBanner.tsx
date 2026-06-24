import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Colors, Radius, Spacing } from "@/constants/theme";

interface AuthErrorBannerProps {
  message?: string | null;
}

export function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  if (!message) return null;

  return (
    <View
      style={{
        backgroundColor: Colors.dark.errorSurface,
        borderColor: Colors.dark.error,
        borderCurve: "continuous",
        borderRadius: Radius.md,
        borderWidth: 1,
        gap: Spacing.one,
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.three,
      }}
    >
      <AppText variant="label" color="error">
        Request failed
      </AppText>
      <AppText selectable variant="small" color="textSecondary">
        {message}
      </AppText>
    </View>
  );
}
