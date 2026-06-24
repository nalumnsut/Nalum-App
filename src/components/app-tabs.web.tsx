import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { type Href } from 'expo-router';
import { Pressable, View, StyleSheet } from 'react-native';

import { AppText } from './ui/app-text';

import { Colors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href={"/(tabs)" as Href} asChild>
            <TabButton>Dashboard</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href={"/(tabs)/explore" as Href} asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View
        style={[
          styles.tabButtonView,
          {
            backgroundColor: isFocused ? Colors.dark.primary : Colors.dark.backgroundElement,
            borderColor: isFocused ? Colors.dark.primary : Colors.dark.border,
          },
        ]}>
        <AppText variant="small" color={isFocused ? 'inverseText' : 'textSecondary'}>
          {children}
        </AppText>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>
        <AppText variant="label" style={styles.brandText}>
          Nalum
        </AppText>

        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
    borderRadius: Radius.round,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
  },
  brandText: {
    marginRight: 'auto',
    paddingHorizontal: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    borderRadius: Radius.round,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
