import { Pressable, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Spacing } from "@/constants/theme";

type AuthLinkRowProps = {
  label: string;
  actionLabel: string;
  onPress: () => void;
  testID?: string;
};

export function AuthLinkRow({ label, actionLabel, onPress, testID }: AuthLinkRowProps) {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        gap: Spacing.two,
        justifyContent: "center",
      }}
    >
      <AppText variant="small" color="textSecondary">
        {label}
      </AppText>
      <Pressable accessibilityRole="link" onPress={onPress} testID={testID}>
        <AppText variant="label" color="primary">
          {actionLabel}
        </AppText>
      </Pressable>
    </View>
  );
}
