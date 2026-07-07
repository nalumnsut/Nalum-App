import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

/**
 * Single post detail screen — placeholder
 *
 * Will render PostCard (full-width) + CommentList (FlashList).
 * Fetched via TanStack Query: GET /posts/:id + GET /posts/:id/comments
 */
export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-[#0a0a0a]">
      <View className="flex-1 items-center justify-center px-canvas">
        <Text className="text-body-md text-on-surface-variant dark:text-[#737373] text-center">
          Post{' '}
          <Text className="font-mono text-label-caps text-on-surface-variant dark:text-[#737373]">
            {id}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
