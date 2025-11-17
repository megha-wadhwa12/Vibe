import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import OnboardingDots from '@/components/OnboardingDots';
import { onboardingStyles as s } from '@/styles/onboarding';

export default function Screen3() {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push('/onboarding/screen4')} style={s.pressable}>
      <LinearGradient
        colors={['#FFE5D9', '#FFF0E1']}
        style={s.container}
      >
        <Text style={s.title}>
          No followers. No numbers.
        </Text>
        <Text style={s.subtitle}>
          Just real connections — if you both vibe, you see each other's moods.
        </Text>

        <OnboardingDots total={4} current={2} />
      </LinearGradient>
    </Pressable>
  );
}
