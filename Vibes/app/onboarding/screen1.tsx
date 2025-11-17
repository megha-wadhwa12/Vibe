import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import OnboardingDots from '@/components/OnboardingDots';
import { onboardingStyles as s } from '@/styles/onboarding';

export default function Screen1() {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push('/onboarding/screen2')} style={{ flex: 1 }}>
      <LinearGradient colors={['#f9b0d6ff', '#e5e5f9ff']} style={s.container}>
        <Text style={s.title}>Welcome to Vibe💫</Text>
        <Text style={s.subtitle}>
          Your space to feel, express, and connect emotionally.
        </Text>

        <OnboardingDots total={4} current={0} />
      </LinearGradient>
    </Pressable>
  );
}
