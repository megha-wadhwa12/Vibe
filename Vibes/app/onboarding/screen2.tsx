import { View, Text, TouchableOpacity, Pressable, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import OnboardingDots from '@/components/OnboardingDots';
import { onboardingStyles as s } from '@/styles/onboarding';

export default function Screen2() {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push('/onboarding/screen3')} style={s.pressable}>
      <LinearGradient
        colors={['#E9D5FF', '#F5E1FF']}
        style={s.container}
      >
        <Image
          source={require('../../assets/images/OnboardingStar.png')}
          resizeMode="contain"
          style={s.image}
        />
        
        <Text style={s.title}>
          Vibe is a mood-based social app.
        </Text>
        <Text style={s.subtitle}>
          Share your emotions through images, songs, quotes, or words.
        </Text>

        <OnboardingDots total={4} current={1} />
      </LinearGradient>
    </Pressable>
  );
}
