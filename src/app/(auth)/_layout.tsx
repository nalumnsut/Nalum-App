import { Stack } from "expo-router";

/**
 * Auth route group layout.
 * All auth screens share a headerless Stack navigator.
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="otp-verify" />
      <Stack.Screen name="verify-pending" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
