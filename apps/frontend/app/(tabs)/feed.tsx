import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Feed screen — placeholder
 *
 * Will render a FlashList of PostCard components fetched via TanStack Query
 * (useInfiniteQuery with cursor-based pagination on UUIDv7).
 * See instructions/overview.instruction.md for full architecture.
 */
export default function FeedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-[#0a0a0a]" edges={['top']}>
      <View className="flex-1 items-center justify-center px-canvas">
        {/* App wordmark */}
        <Text className="text-display font-sans font-semibold text-on-surface dark:text-[#f0f0f0] tracking-tight mb-sm">
          Nalum
        </Text>
        <Text className="text-body-md text-on-surface-variant dark:text-[#737373] text-center">
          Feed coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
