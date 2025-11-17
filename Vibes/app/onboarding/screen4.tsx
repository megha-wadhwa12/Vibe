import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import OnboardingDots from '@/components/OnboardingDots';
import { onboardingStyles as s } from '@/styles/onboarding';

export default function Screen4() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FFEAF6', '#FFF6FB']}
      style={s.container}
    >
      <Image
        source={require('../../assets/images/OnboardingSky.png')}
        resizeMode="contain"
        style={s.skyImage}
      />
      <Text style={s.title}>Ready to vibe?</Text>
      <Text style={s.subtitle}>Start your journey of emotional expression.</Text>

      <OnboardingDots total={4} current={3} />

      <TouchableOpacity style={s.getStarted} onPress={() => router.replace('/auth/signup/basic-info')}>
        <Text style={s.getStartedText}>Get Started →</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/auth/login')} style={{ marginTop: 10 }}>
        <Text style={s.smallLink}>Already vibing? Log in</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}