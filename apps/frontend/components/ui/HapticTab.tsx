import { Pressable, type GestureResponderEvent } from 'react-native';
import type { PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// expo-router re-exports Tabs from @react-navigation/bottom-tabs under the hood.
// We define our own minimal prop shape to avoid the direct peer-dep import.
type TabBarButtonProps = PressableProps & {
  children?: React.ReactNode;
  onPress?: ((e: GestureResponderEvent) => void) | null;
};

/**
 * Tab bar button with haptic feedback on native.
 * Safe on web — Haptics module no-ops on Platform.OS === 'web'.
 */
export function HapticTab(props: TabBarButtonProps) {
  const handlePress = async (event: GestureResponderEvent) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    props.onPress?.(event);
  };

  return (
    <Pressable
      {...props}
      onPress={handlePress}
      android_ripple={{ color: 'transparent' }}
    />
  );
}
