import { Text, type TextProps } from "react-native";

import { Colors, Typography, type ThemeColor } from "@/constants/theme";

type AppTextVariant = keyof typeof Typography;

export type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  color?: ThemeColor;
};

export function AppText({
  variant = "body",
  color = "text",
  selectable,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      selectable={selectable}
      style={[Typography[variant], { color: Colors.dark[color] }, style]}
      {...props}
    />
  );
}
