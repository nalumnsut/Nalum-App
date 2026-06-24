import { type Href, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AppThemeProvider } from "@/components/app-theme-provider";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Auth guard hook.
 *
 * Watches isAuthenticated + isLoading and redirects to the correct route.
 * Lives in a separate component so it can call hooks after the Store and
 * Router are both available in the tree.
 */
function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading) return; // wait for cold-start refresh to settle

    const inAuthGroup = (segments[0] as string) === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/sign-in" as Href);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)" as Href);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  return null;
}

/**
 * Root layout.
 *
 * On mount, attempts a silent session refresh (using the HTTP-only cookie
 * from the server). While isLoading is true a full-screen spinner is shown
 * to prevent a flash of the wrong route. After the refresh settles, AuthGuard
 * redirects the user to the appropriate screen.
 */
export default function RootLayout() {
  const refresh = useAuthStore((s) => s.refresh);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Attempt silent refresh on cold start.
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppThemeProvider>
      <AnimatedSplashOverlay />
      <AuthGuard />

      {isLoading ? (
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: Colors.dark.background },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      )}
    </AppThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
