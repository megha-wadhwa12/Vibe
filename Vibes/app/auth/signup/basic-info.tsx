import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { signupStyles as s } from '@/styles/signup'
import ProgressIndicator from '@/components/ProgressIndicator'
import ProfilePhotoPicker from '@/components/ProfilePhotoPicker'
import { useRouter } from 'expo-router'

export default function BasicInfo() {

  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleContinue = () => {
    if (!firstName || !lastName) {
      alert('Please fill in both fields');
      return;
    }
    router.push('/auth/signup/signup-account-details');
  };

  const isDisabled = !firstName.trim() || !lastName.trim();

  return (
    <View style={s.screen}>
      <LinearGradient colors={['#E6E0FF', '#FFD8BE']} style={s.container}>
        <ProgressIndicator total={4} current={0} />
        <Text style={s.title}>What's your name?</Text>
        <ProfilePhotoPicker />
        <View style={s.form}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#b8b8b8"
            style={s.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#b8b8b8"
            style={s.input}
            value={lastName}
            onChangeText={setLastName}
          />
          <Pressable
            onPress={handleContinue}
            style={[
              s.button,
              isDisabled && { opacity: 0.5 },
            ]}
            disabled={isDisabled}
          >
            <Text style={s.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  )
}