import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

/**
 * Single chat thread screen — placeholder
 *
 * Will render a FlashList (inverted) of MessageBubble components.
 * Messages are received in real-time via chatStore's WS connection
 * and cached in TanStack Query with cursor-based pagination.
 *
 * Cursor: UUIDv7 or (created_at, id) composite — never offset.
 */
export default function ConversationScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-[#0a0a0a]" edges={['bottom']}>
      <View className="flex-1 items-center justify-center px-canvas">
        <Text className="text-body-md text-on-surface-variant dark:text-[#737373] text-center">
          Conversation{' '}
          <Text className="font-mono text-label-caps text-on-surface-variant dark:text-[#737373]">
            {conversationId}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
