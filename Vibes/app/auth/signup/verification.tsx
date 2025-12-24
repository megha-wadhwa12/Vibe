import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect } from 'react'
import { Pressable, Text, View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { signupStyles as s } from '@/styles/signup'
import ProgressIndicator from '@/components/ProgressIndicator'
import { useRouter } from 'expo-router'
import { useSignup } from '@/contexts/SignupContext'

import { sendEmailVerification } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'

export default function Verify() {
  const router = useRouter()
  const { signupData } = useSignup()

  const [resendTimer, setResendTimer] = useState(0)
  const [error, setError] = useState<string | undefined>()
  const [isChecking, setIsChecking] = useState(false)

  const handleResendVerification = async () => {
    if (resendTimer > 0) return

    if (!auth.currentUser) {
      setError('User not found, please login again.')
      return
    }

    try {
      setError(undefined)

      await sendEmailVerification(auth.currentUser)

      setResendTimer(30)
    } catch (err) {
      setError('Failed to resend verification email. Try again.')
    }
  }

  const handleCheckVerification = async () => {
    try {
      setIsChecking(true)
      setError(undefined)

      if (!auth.currentUser) {
        setError('User not found, please login again.')
        return
      }

      await auth.currentUser?.reload()
      if (auth.currentUser?.emailVerified) router.replace('/home')
      else setError('Please verify your email first.')

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  return (
    <View style={s.screen}>
      <LinearGradient colors={['#E0F2FF', '#E6E0FF']} style={s.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.content}
        >
          <ProgressIndicator total={4} current={3} />

          <Text style={s.title}>Verify your email</Text>

          <Text style={s.subtitle}>
            We’ve sent a verification link to your email address.
            Please check your inbox and click the link to continue.
          </Text>

          {error && <Text style={s.errorText}>{error}</Text>}

          <Pressable
            onPress={handleCheckVerification}
            style={[s.button, isChecking && { opacity: 0.6 }]}
            disabled={isChecking}
          >
            <LinearGradient
              colors={['#B1A1F3', '#9A89FF']}
              style={s.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={s.buttonText}>
                {isChecking ? 'Checking...' : "I've verified"}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Resend email */}
          <Pressable
            onPress={handleResendVerification}
            disabled={resendTimer > 0}
            style={{ marginTop: 20 }}
          >
            <Text
              style={[
                styles.resendText,
                resendTimer > 0 && styles.resendTextDisabled,
              ]}
            >
              {resendTimer > 0
                ? `Resend email (${resendTimer}s)`
                : 'Resend verification email'}
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  resendText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  resendTextDisabled: {
    opacity: 0.5,
  },
})