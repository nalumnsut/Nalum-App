import { Tabs } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { HapticTab } from '../../components/ui/HapticTab';

// Using @expo/vector-icons (ships with Expo, no extra install needed)
import { Ionicons } from '@expo/vector-icons';

// ─── Tab icon helper ─────────────────────────────────────────────────────────
type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  activeName,
  color,
  focused,
}: {
  name: IconName;
  activeName: IconName;
  // ColorValue from react-native — cast to string for Ionicons prop
  color: string | import('react-native').ColorValue;
  focused: boolean;
}) {
  return (
    <Ionicons
      name={focused ? activeName : name}
      size={24}
      color={color as string}
      style={{ marginBottom: -3 }}
    />
  );
}

// ─── Design tokens (mirroring Kinship Protocol) ───────────────────────────────
const ACCENT = '#ef4544';       // Engineering Red — active tab
const INACTIVE = '#737373';     // Muted gray — inactive tabs
const BG_LIGHT = '#fbf9f9';
const BG_DARK = '#0a0a0a';
const BORDER_LIGHT = '#e9e8e7';
const BORDER_DARK = '#262626';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: isDark ? BG_DARK : BG_LIGHT,
          borderTopWidth: 1,
          borderTopColor: isDark ? BORDER_DARK : BORDER_LIGHT,
          // No shadow — elevation communicated through tonal layering (Kinship)
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 82 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'GoogleSansFlex-Medium',
          letterSpacing: 0.1,
          marginTop: 2,
        },
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home-outline" activeName="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="notifications-outline"
              activeName="notifications"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="chatbubble-outline"
              activeName="chatbubble"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="person-outline"
              activeName="person"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
