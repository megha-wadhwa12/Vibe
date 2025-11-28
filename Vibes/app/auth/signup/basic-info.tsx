import ProfilePhotoPicker from '@/components/ProfilePhotoPicker'
import ProgressIndicator from '@/components/ProgressIndicator'
import { useSignup } from '@/contexts/SignupContext'
import { validateName } from '@/lib/validation'
import { signupStyles as s } from '@/styles/signup'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native'

export default function BasicInfo() {
  const router = useRouter();
  const { signupData, updateSignupData } = useSignup();
  const [firstName, setFirstName] = useState(signupData.firstName);
  const [lastName, setLastName] = useState(signupData.lastName);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  const handleContinue = () => {
    const firstNameValidation = validateName(firstName);
    const lastNameValidation = validateName(lastName);

    const newErrors: { firstName?: string; lastName?: string } = {};
    
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.error;
    }
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    updateSignupData({ firstName: firstName.trim(), lastName: lastName.trim() });
    router.push('/auth/signup/account-details' as any);
  };

  const isDisabled = !firstName.trim() || !lastName.trim();

  return (
    <View style={s.screen}>
      <LinearGradient colors={['#E6E0FF', '#FFD8BE']} style={s.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.content}
        >
          <ProgressIndicator total={4} current={0} />
          <Text style={s.title}>What's your name?</Text>
          <ProfilePhotoPicker />
          <View style={s.form}>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#b8b8b8"
              style={[s.input, errors.firstName && { borderColor: '#FF6B6B', borderWidth: 1 }]}
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                if (errors.firstName) {
                  setErrors({ ...errors, firstName: undefined });
                }
              }}
              autoCapitalize="words"
            />
            {errors.firstName && <Text style={s.errorText}>{errors.firstName}</Text>}
            
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#b8b8b8"
              style={[s.input, errors.lastName && { borderColor: '#FF6B6B', borderWidth: 1 }]}
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                if (errors.lastName) {
                  setErrors({ ...errors, lastName: undefined });
                }
              }}
              autoCapitalize="words"
            />
            {errors.lastName && <Text style={s.errorText}>{errors.lastName}</Text>}
            
            <Pressable
              onPress={handleContinue}
              style={[
                s.button,
                isDisabled && { opacity: 0.5 },
              ]}
              disabled={isDisabled}
            >
              <LinearGradient
                colors={['#d0a0eeff', '#ab73d1ff']}
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