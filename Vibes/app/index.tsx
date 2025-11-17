import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const firstTimeUser = true;
      if (firstTimeUser) {
        router.replace("/onboarding/screen1");
      } else {
        router.replace("/auth/signup/basic-info");
      }
    }, 200);
      return () => clearTimeout(timer);
    }, []);

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Welcome to Vibes!</Text>
      </View>
    );
  }