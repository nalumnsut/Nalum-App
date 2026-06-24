import { Button as ExpoButton } from "@expo/ui";
import { ActivityIndicator } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Colors, Radius, Spacing } from "@/constants/theme";

type AppButtonVariant = "primary" | "secondary" | "ghost";

export type AppButtonProps = {
  label: string;
  loading?: boolean;
  variant?: AppButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
  id?: string;
  onPress?: () => void;
  testID?: string;
  style?: object;
};

export function AppButton({
  label,
  loading = false,
  variant = "primary",
  disabled,
  fullWidth = true,
  onPress,
  id,
  testID,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";

  return (
    <ExpoButton
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      testID={testID ?? id}
      variant={isPrimary ? "filled" : isGhost ? "text" : "outlined"}
      style={
        [
          {
            alignItems: "center",
            backgroundColor: isPrimary
              ? Colors.dark.primary
              : isGhost
                ? "transparent"
                : Colors.dark.backgroundElement,
            borderColor: isPrimary ? Colors.dark.primary : Colors.dark.borderStrong,
            borderRadius: Radius.md,
            borderWidth: isGhost ? 0 : 1,
            height: 50,
            justifyContent: "center",
            opacity: isDisabled ? 0.55 : 1,
            paddingHorizontal: Spacing.four,
            paddingVertical: Spacing.three,
            width: fullWidth ? "100%" : undefined,
          },
          style,
        ] as object
      }
    >
      {loading ? (
        <ActivityIndicator color={Colors.dark.inverseText} size="small" />
      ) : (
        <AppText
          variant="button"
          color={isPrimary ? "inverseText" : isGhost ? "primary" : "text"}
          style={{ textAlign: "center" }}
        >
          {label}
        </AppText>
      )}
    </ExpoButton>
  );
}
