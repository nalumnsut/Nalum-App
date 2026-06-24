import AppTabs from "@/components/app-tabs";

/**
 * Tab group layout. Renders the AppTabs component which handles both the
 * native tab bar (iOS/Android) and the web top-nav variant via platform
 * file selection (.web.tsx).
 */
export default function TabsLayout() {
  return <AppTabs />;
}
