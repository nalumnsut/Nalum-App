import { View, type ViewProps } from "react-native";

import { Colors, Radius, Spacing } from "@/constants/theme";

type SurfaceProps = ViewProps & {
  elevated?: boolean;
};

export function Surface({ elevated = false, style, ...props }: SurfaceProps) {
  return (
    <View
      style={[
        {
          backgroundColor: elevated ? Colors.dark.cardRaised : Colors.dark.card,
          borderColor: Colors.dark.border,
          borderCurve: "continuous",
          borderRadius: Radius.lg,
          borderWidth: 1,
          padding: Spacing.five,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.35)",
        },
        style,
      ]}
      {...props}
    />
  );
}
