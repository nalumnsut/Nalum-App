import '../global.css';

import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

// Keep the splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    // Google Sans — primary typeface (loaded from assets/fonts/)
    // "GoogleSansFlex" key matches the fontFamily token in tailwind.config.js
    'GoogleSansFlex': require('../assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSansFlex-Medium': require('../assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSansFlex-SemiBold': require('../assets/fonts/GoogleSans-SemiBold.ttf'),
    'GoogleSansFlex-Bold': require('../assets/fonts/GoogleSans-Bold.ttf'),
    // JetBrains Mono — metadata only (graduation year, IDs, timestamps, stats)
    'JetBrainsMono': require('../assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="post/[id]"
            options={{
              headerShown: true,
              headerTitle: 'Post',
              headerBackTitle: 'Back',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="profile/[userId]"
            options={{
              headerShown: true,
              headerTitle: 'Profile',
              headerBackTitle: 'Back',
              presentation: 'card',
            }}
          />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
