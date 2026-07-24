import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Button, Card, Field, Screen } from "@/components/ui/nalum";
import { profileApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const p = user?.profile;
  const [city, setCity] = useState(p?.city ?? "");
  const [country, setCountry] = useState(p?.country ?? "");
  const [company, setCompany] = useState(p?.currentCompany ?? "");
  const [role, setRole] = useState(p?.currentRole ?? "");
  const [linkedin, setLinkedin] = useState(user?.socialMedia?.linkedin ?? "");
  const [github, setGithub] = useState(user?.socialMedia?.github ?? "");
  const [experienceCompany, setExperienceCompany] = useState(
    user?.experiences[0]?.company ?? "",
  );
  const [experienceRole, setExperienceRole] = useState(
    user?.experiences[0]?.role ?? "",
  );
  const [photo, setPhoto] = useState<string | undefined>();
  if (!user) return null;
  const pick = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!r.canceled) setPhoto(r.assets[0].uri);
  };
  const save = async () => {
    try {
      const form = new FormData();
      form.append("city", city);
      form.append("country", country);
      form.append("currentCompany", company);
      form.append("currentRole", role);
      form.append(
        "socialMedia",
        JSON.stringify({ linkedin: linkedin || null, github: github || null }),
      );
      if (experienceCompany && experienceRole)
        form.append(
          "experiences",
          JSON.stringify([
            {
              company: experienceCompany,
              role: experienceRole,
              isCurrent: true,
            },
          ]),
        );
      if (photo)
        form.append("profilePicture", {
          uri: photo,
          name: "profile.jpg",
          type: "image/jpeg",
        } as unknown as Blob);
      await profileApi.update(form);
      Alert.alert("Saved", "Your profile has been updated.");
      router.replace("/directory");
    } catch (e) {
      Alert.alert(
        "Could not save",
        e instanceof Error ? e.message : "Try again.",
      );
    }
  };
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="mb-5 text-3xl font-bold text-foreground">
          My profile
        </Text>
        <Card>
          <View className="gap-3">
            <Image
              source={photo ?? p?.profilePicture ?? undefined}
              style={{
                height: 88,
                width: 88,
                borderRadius: 44,
                backgroundColor: "#ded6d7",
              }}
            />
            <Button variant="secondary" onPress={pick}>
              Change photo
            </Button>
            <Text className="text-xl font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="text-muted">{user.email}</Text>
            <Field
              value={city}
              onChangeText={setCity}
              placeholder="Current city"
            />
            <Field
              value={country}
              onChangeText={setCountry}
              placeholder="Country"
            />
            <Field
              value={company}
              onChangeText={setCompany}
              placeholder="Current company"
            />
            <Field
              value={role}
              onChangeText={setRole}
              placeholder="Current role"
            />
            <Field
              value={linkedin}
              onChangeText={setLinkedin}
              placeholder="LinkedIn URL"
            />
            <Field
              value={github}
              onChangeText={setGithub}
              placeholder="GitHub URL"
            />
            <Text className="mt-2 font-semibold text-foreground">
              Current experience
            </Text>
            <Field
              value={experienceCompany}
              onChangeText={setExperienceCompany}
              placeholder="Company"
            />
            <Field
              value={experienceRole}
              onChangeText={setExperienceRole}
              placeholder="Role"
            />
            <Button onPress={save}>Save changes</Button>
            <Button
              variant="ghost"
              onPress={() => router.replace("/directory")}
            >
              Back to directory
            </Button>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}
