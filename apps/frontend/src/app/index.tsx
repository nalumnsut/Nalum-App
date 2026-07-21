import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
export default function Index() { const {ready,setReady,setUser} = useAuthStore(); useEffect(()=>{authApi.restore().then(setUser).catch(()=>setUser(null)).finally(()=>setReady());},[setReady,setUser]); useEffect(()=>{if(!ready)return; const user=useAuthStore.getState().user; router.replace(!user?'/sign-in':!user.emailVerified?'/verify':!user.profileCompleted?'/onboarding':'/directory');},[ready]); return <View className="flex-1 items-center justify-center bg-background"><ActivityIndicator color="#7a1f35" /></View>; }
