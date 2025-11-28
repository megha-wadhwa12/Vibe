import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Pressable, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native'
import { signupStyles as s } from '@/styles/signup'
import ProgressIndicator from '@/components/ProgressIndicator'
import { useRouter } from 'expo-router'
import { useSignup } from '@/contexts/SignupContext'
import { validateEmailOrPhone, validateUsername, validatePassword } from '@/lib/validation'
import { Ionicons } from '@expo/vector-icons'

export default function AccountDetails() {
  const router = useRouter();
  const { signupData, updateSignupData } = useSignup();
  const [emailOrPhone, setEmailOrPhone] = useState(signupData.emailOrPhone);
  const [username, setUsername] = useState(signupData.username);
  const [password, setPassword] = useState(signupData.password);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    emailOrPhone?: string;
    username?: string;
    password?: string;
  }>({});

  const handleContinue = () => {
    const emailOrPhoneValidation = validateEmailOrPhone(emailOrPhone);
    const usernameValidation = validateUsername(username);
    const passwordValidation = validatePassword(password);

    const newErrors: typeof errors = {};
    
    if (!emailOrPhoneValidation.isValid) {
      newErrors.emailOrPhone = emailOrPhoneValidation.error;
    }
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error;
    }
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    updateSignupData({
      emailOrPhone: emailOrPhone.trim(),
      username: username.trim(),
      password: password,
    });
    router.push('/auth/signup/birthday');
  };

  const isDisabled = !emailOrPhone.trim() || !username.trim() || !password;

  return (
    <View style={s.screen}>
      <LinearGradient colors={['#F0E6FF', '#FFFFFF']} style={s.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.content}
        >
          <ProgressIndicator total={4} current={1} />
          <Text style={s.title}>Create your account</Text>
          <View style={s.form}>
            <Text style={s.inputLabel}>Email or phone number</Text>
            <TextInput
              placeholder="Enter your email or phone number"
              placeholderTextColor="#b8b8b8"
              style={[s.input, errors.emailOrPhone && { borderColor: '#FF6B6B', borderWidth: 1 }]}
              value={emailOrPhone}
              onChangeText={(text) => {
                setEmailOrPhone(text);
                if (errors.emailOrPhone) {
                  setErrors({ ...errors, emailOrPhone: undefined });
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.emailOrPhone && <Text style={s.errorText}>{errors.emailOrPhone}</Text>}

            <Text style={s.inputLabel}>Username</Text>
            <TextInput
              placeholder="Choose a username"
              placeholderTextColor="#b8b8b8"
              style={[s.input, errors.username && { borderColor: '#FF6B6B', borderWidth: 1 }]}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) {
                  setErrors({ ...errors, username: undefined });
                }
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && <Text style={s.errorText}>{errors.username}</Text>}

            <Text style={s.inputLabel}>Password</Text>
            <View style={{ position: 'relative', width: '100%' }}>
              <TextInput
                placeholder="Create a password"
                placeholderTextColor="#b8b8b8"
                style={[s.input, errors.password && { borderColor: '#FF6B6B', borderWidth: 1 }, { paddingRight: 50 }]}
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
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 15,
                  top: 15,
                }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#999"
                />
              </Pressable>
            </View>
            {errors.password && <Text style={s.errorText}>{errors.password}</Text>}

            <Pressable
              onPress={handleContinue}
              style={[
                s.button,
                isDisabled && { opacity: 0.5 },
              ]}
              disabled={isDisabled}
            >
              <LinearGradient
                colors={['#9A89FF', '#8B7AFF']}
                style={s.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={s.buttonText}>Continue</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  )
}

