import { Stack } from 'expo-router';

/**
 * Chat sub-navigator layout.
 * The WS connection is owned by chatStore (Zustand), not here —
 * so it survives navigation between tabs without disconnecting.
 */
export default function ChatLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[conversationId]"
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: 'Messages',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
