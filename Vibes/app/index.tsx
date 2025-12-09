import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkAppState = async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      const userRegistered = await AsyncStorage.getItem("userRegistered");

      if (hasOnboarded) {
        router.replace("/home");
        return;
      }

      if (!hasOnboarded) {
        router.replace("/onboarding/screen1");
        return;
      }

      if (!hasOnboarded && userRegistered) {
        router.replace("/home");
        return;
      }

    } catch (error) {
      console.error("Error checking app state:", error);
      router.replace("/onboarding/screen1"); // fallback to onboarding
    } finally {
      setLoading(false);
    }
  };

  checkAppState();
}, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f9b0d6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
});
