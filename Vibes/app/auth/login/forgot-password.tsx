import { sendPasswordReset } from '@/lib/auth';
import { validateEmail } from '@/lib/validation';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendReset = async () => {
    // Validate email
    const emailValidation = validateEmail(email);

    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    setError(undefined);
    setIsLoading(true);

    try {
      const result = await sendPasswordReset(email.trim());

      if (result.success) {
        Alert.alert(
          'Reset Link Sent',
          'Please check your email for password reset instructions.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth/login/login-screen'),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#E6E0FF', '#E0F0FF']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View entering={FadeIn.duration(600)} style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>∞</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <Text style={styles.title}>Forgot Your Password?</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(600)}>
              <Text style={styles.subtitle}>
                No worries! Enter your email and we'll send you a reset link.
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.form}
            >
              <Text style={styles.inputLabel}>Email address</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#b8b8b8"
                style={[styles.input, error && styles.inputError]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) {
                    setError(undefined);
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!isLoading}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}

              <Pressable
                onPress={handleSendReset}
                style={[styles.buttonContainer, isLoading && styles.buttonDisabled]}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#FFB366', '#FFA366']}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={() => router.replace('/auth/login/login-screen')}
                style={styles.backLink}
                disabled={isLoading}
              >
                <Text style={styles.backLinkText}>Back to Login</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 4,
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  backLink: {
    marginTop: 20,
  },
  backLinkText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },
});

