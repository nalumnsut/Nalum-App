import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Profile screen (own profile tab) — placeholder
 *
 * Will render the authenticated user's profile.
 * For viewing another user's profile, see app/profile/[userId].tsx.
 */
export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-[#0a0a0a]" edges={['top']}>
      <View className="px-canvas pt-md pb-sm border-b border-[#e9e8e7] dark:border-[#262626]">
        <Text className="text-headline-lg font-sans font-semibold text-on-surface dark:text-[#f0f0f0]">
          Profile
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-canvas">
        <Text className="text-body-md text-on-surface-variant dark:text-[#737373] text-center">
          Your profile
        </Text>
      </View>
    </SafeAreaView>
  );
}
