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

        // 🔄 Opposite of original:
        // If hasOnboarded *exists* → send user back to onboarding
        if (hasOnboarded) {
          router.replace("/onboarding/screen1");
          return;
        }

        // If NOT onboarded and NOT registered → send to /home directly
        if (!hasOnboarded && !userRegistered) {
          router.replace("/home");
          return;
        }

        // If onboarded is missing but userRegistered *exists*
        // → show loader briefly then go to /home
        if (!hasOnboarded && userRegistered) {
          setTimeout(() => {
            router.replace("/home");
          }, 1000);
          return;
        }

      } catch (error) {
        console.error("Error checking app state:", error);
        router.replace("/home"); // Opposite of original fallback
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
