import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Conversation list screen — placeholder
 *
 * Will render a FlashList of ConversationItem components.
 * Conversations are fetched via TanStack Query (cursor-based).
 * The WebSocket connection lives in chatStore, not here.
 */
export default function ChatIndexScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-[#0a0a0a]" edges={['top']}>
      <View className="px-canvas pt-md pb-sm border-b border-[#e9e8e7] dark:border-[#262626]">
        <Text className="text-headline-lg font-sans font-semibold text-on-surface dark:text-[#f0f0f0]">
          Messages
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-canvas">
        <Text className="text-body-md text-on-surface-variant dark:text-[#737373] text-center">
          No conversations yet
        </Text>
      </View>
    </SafeAreaView>
  );
}
