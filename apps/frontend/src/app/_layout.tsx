import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

function AppNavigator() {
  const { ready, setReady, setUser, user } = useAuthStore();

  useEffect(() => {
    authApi
      .restore()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(setReady);
  }, [setReady, setUser]);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#7a1f35" />
      </View>
    );
  }

  const signedIn = user !== null;
  const emailVerified = signedIn && user.emailVerified;
  const profileCompleted = emailVerified && user.profileCompleted;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/callback" />

      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack.Protected>

      <Stack.Protected guard={signedIn && !emailVerified}>
        <Stack.Screen name="verify" />
      </Stack.Protected>

      <Stack.Protected guard={emailVerified && !profileCompleted}>
        <Stack.Screen name="profile" />
      </Stack.Protected>

      <Stack.Protected guard={profileCompleted}>
        <Stack.Screen name="directory" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="profile/edit" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <AppNavigator />
    </QueryClientProvider>
  );
}
