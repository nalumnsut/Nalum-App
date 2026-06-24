import { ScrollView, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Surface } from "@/components/ui/surface";
import { Colors, MaxContentWidth, Radius, Spacing } from "@/constants/theme";

const sections = [
  {
    title: "Network",
    body: "Find alumni, students, and campus connections as profile and directory modules come online.",
  },
  {
    title: "Opportunities",
    body: "A dedicated surface for referrals, internships, mentoring, and professional updates.",
  },
  {
    title: "Events",
    body: "Upcoming reunions, chapter meetups, and institute announcements will live here.",
  },
];

export default function ExploreScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: Colors.dark.background }}
      contentContainerStyle={{
        alignItems: "center",
        gap: Spacing.five,
        paddingBottom: Spacing.eight + 84,
        paddingHorizontal: Spacing.five,
        paddingTop: Spacing.eight,
      }}
    >
      <View style={{ gap: Spacing.five, maxWidth: MaxContentWidth, width: "100%" }}>
        <View style={{ gap: Spacing.three }}>
          <AppText variant="hero">Explore Nalum</AppText>
          <AppText variant="body" color="textSecondary">
            A focused workspace for the alumni network, using the same design system as auth and dashboard screens.
          </AppText>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.four }}>
          {sections.map((section, index) => (
            <Surface key={section.title} elevated style={{ flexBasis: 260, flexGrow: 1, gap: Spacing.four }}>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: index === 0 ? Colors.dark.primary : Colors.dark.backgroundElement,
                  borderCurve: "continuous",
                  borderRadius: Radius.md,
                  height: 42,
                  justifyContent: "center",
                  width: 42,
                }}
              >
                <AppText variant="label" color={index === 0 ? "inverseText" : "textSecondary"}>
                  {String(index + 1).padStart(2, "0")}
                </AppText>
              </View>
              <View style={{ gap: Spacing.two }}>
                <AppText variant="section">{section.title}</AppText>
                <AppText variant="body" color="textSecondary">
                  {section.body}
                </AppText>
              </View>
            </Surface>
          ))}
        </View>

        <Surface style={{ gap: Spacing.two }}>
          <AppText variant="section">Design rule</AppText>
          <AppText variant="body" color="textSecondary">
            Black owns the surface, charcoal creates structure, and crimson is reserved for high-value actions and active states.
          </AppText>
        </Surface>
      </View>
    </ScrollView>
  );
}
