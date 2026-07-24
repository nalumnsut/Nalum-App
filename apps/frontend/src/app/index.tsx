import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { getAuthRoute } from "@/lib/auth-navigation";
import { useAuthStore } from "@/stores/auth-store";
export default function Index() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    router.replace(getAuthRoute(user));
  }, [user]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator color="#7a1f35" />
    </View>
  );
}
