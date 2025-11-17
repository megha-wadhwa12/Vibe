import OnboardingDots from "@/components/OnboardingDots";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function OnboardingLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
