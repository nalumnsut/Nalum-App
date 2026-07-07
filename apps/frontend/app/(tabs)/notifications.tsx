import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Notifications screen — placeholder
 *
 * Will render a FlashList of NotificationItem components fetched via
 * TanStack Query (useInfiniteQuery, cursor-based).
 */
export default function NotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-[#0a0a0a]" edges={['top']}>
      <View className="px-canvas pt-md pb-sm border-b border-[#e9e8e7] dark:border-[#262626]">
        <Text className="text-headline-lg font-sans font-semibold text-on-surface dark:text-[#f0f0f0]">
          Notifications
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-canvas">
        <Text className="text-body-md text-on-surface-variant dark:text-[#737373] text-center">
          No notifications yet
        </Text>
      </View>
    </SafeAreaView>
  );
}
