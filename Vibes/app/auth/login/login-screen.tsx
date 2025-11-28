import { login } from '@/lib/auth';
import { validateEmailOrUsername, validatePassword } from '@/lib/validation';
import { Ionicons } from '@expo/vector-icons';
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

export default function LoginScreen() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    emailOrUsername?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    const emailValidation = validateEmailOrUsername(emailOrUsername);
    const passwordValidation = validatePassword(password);

    const newErrors: typeof errors = {};

    if (!emailValidation.valid) {
      newErrors.emailOrUsername = emailValidation.message;
    }
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await login({
        emailOrUsername: emailOrUsername.trim(),
        password,
      });

      if (result.success) {
        router.replace('/home');
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials. Please try again.');
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
        colors={['#FFE5F1', '#E6E0FF', '#E0F0FF']}
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
            <Animated.View entering={FadeIn.duration(600)} style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>V</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <Text style={styles.title}>Welcome back to Vibe</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(300).duration(600)}
              style={styles.form}
            >
              <TextInput
                placeholder="Email or username"
                placeholderTextColor="#b8b8b8"
                style={[
                  styles.input,
                  errors.emailOrUsername && styles.inputError,
                ]}
                value={emailOrUsername}
                onChangeText={(text) => {
                  setEmailOrUsername(text);
                  if (errors.emailOrUsername) {
                    setErrors({ ...errors, emailOrUsername: undefined });
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!isLoading}
              />
              {errors.emailOrUsername && (
                <Text style={styles.errorText}>{errors.emailOrUsername}</Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#b8b8b8"
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.password && styles.inputError,
                  ]}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#999"
                  />
                </Pressable>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <Pressable
                onPress={handleLogin}
                style={[styles.buttonContainer, isLoading && styles.buttonDisabled]}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#9A89FF', '#8B7AFF']}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={() => router.push('/auth/login/forgot-password')}
                style={styles.forgotPasswordLink}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
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
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#9A89FF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#9A89FF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    width: '100%',
    alignItems: 'center',
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
  passwordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
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
  forgotPasswordLink: {
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },
});

