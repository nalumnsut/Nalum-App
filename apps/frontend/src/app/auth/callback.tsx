import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { router } from 'expo-router';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
export default function GoogleCallback(){useEffect(()=>{authApi.restore().then(user=>{useAuthStore.getState().setUser(user);router.replace(!user.emailVerified?'/verify':!user.profileCompleted?'/onboarding':'/directory');}).catch(()=>router.replace('/sign-in'));},[]);return <View className="flex-1 items-center justify-center bg-background"><ActivityIndicator color="#7a1f35"/><Text className="mt-4 text-muted">Completing Google sign-in…</Text></View>}
