import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

/**
 * Public profile screen — placeholder
 *
 * Used for viewing OTHER users' profiles (linked from feed, search, etc.).
 * For the authenticated user's own profile tab, see app/(tabs)/profile.tsx.
 *
 * Will render: avatar, name, role, metadata row (JetBrains Mono), bio,
 * connect/message CTAs, and the user's post feed (FlashList).
 *
 * Metadata row example (JetBrains Mono — max 5% of UI):
 *   2024 • IT • NSUT
 */
export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-[#0a0a0a]">
      <View className="flex-1 items-center justify-center px-canvas">
        <Text className="text-body-md text-on-surface-variant dark:text-[#737373] text-center">
          Profile{' '}
          <Text className="font-mono text-label-caps text-on-surface-variant dark:text-[#737373]">
            {userId}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
