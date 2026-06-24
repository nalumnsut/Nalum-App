import { Host } from "@expo/ui";
import { ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, type ReactNode } from "react";

import { Colors } from "@/constants/theme";

const navigationTheme = {
  dark: true,
  colors: {
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.primary,
  },
  fonts: {
    regular: { fontFamily: "Roboto", fontWeight: "400" as const },
    medium: { fontFamily: "Roboto", fontWeight: "400" as const },
    bold: { fontFamily: "Roboto", fontWeight: "700" as const },
    heavy: { fontFamily: "Roboto", fontWeight: "700" as const },
  },
};

type AppThemeProviderProps = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors.dark.background);
  }, []);

  return (
    <ThemeProvider value={navigationTheme}>
      <Host style={{ flex: 1, backgroundColor: Colors.dark.background }}>
        <StatusBar style="light" />
        {children}
      </Host>
    </ThemeProvider>
  );
}
