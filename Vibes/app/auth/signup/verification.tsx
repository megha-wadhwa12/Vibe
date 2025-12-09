import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useRef, useEffect } from 'react'
import { Pressable, Text, TextInput, View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { signupStyles as s } from '@/styles/signup'
import ProgressIndicator from '@/components/ProgressIndicator'
import { useRouter } from 'expo-router'
import { useSignup } from '@/contexts/SignupContext'
import { validateOTP } from '@/lib/validation'
import { sendOTP, verifyOTP } from '@/lib/auth'

export default function Verify() {
  const router = useRouter();
  const { signupData, updateSignupData } = useSignup();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | undefined>();
  const [isVerifying, setIsVerifying ] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    setResendTimer(30);
  }, []);

  useEffect(() => {
    // Countdown timer for resend
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(undefined);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (value && index === 5) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join('');
    const validation = validateOTP(otpCode);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsVerifying(true);
    setError(undefined);

    try {
      const result = await verifyOTP(otpCode, signupData.actualOtp, signupData.otpExpiry);

      if (result.success) {
        updateSignupData({ otpCode: otpCode });
        // Navigate to home
        router.replace('/home');
      } else {
        setError(result.message);
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      await sendOTP(signupData.emailOrPhone);
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      setError(undefined);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    }
  };

  return (
    <View style={s.screen}>
      <LinearGradient colors={['#E0F2FF', '#E6E0FF']} style={s.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.content}
        >
          <ProgressIndicator total={4} current={3} />
          <Text style={s.title}>We sent you a code</Text>
          <Text style={s.subtitle}>
            Enter the 6-digit code we sent to your email.
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref }}
                style={[
                  styles.otpInput,
                  error && styles.otpInputError,
                  digit && styles.otpInputFilled,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                textAlign="center"
                autoFocus={index === 0}
              />
            ))}
          </View>

          {error && <Text style={s.errorText}>{error}</Text>}

          <Pressable
            onPress={() => handleVerify()}
            style={[s.button, isVerifying && { opacity: 0.6 }]}
            disabled={isVerifying || otp.join('').length !== 6}
          >
            <LinearGradient
              colors={['#B1A1F3', '#9A89FF']}
              style={s.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={s.buttonText}>
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={handleResend}
            disabled={resendTimer > 0}
            style={{ marginTop: 20 }}
          >
            <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
              {resendTimer > 0 ? `Resend code (${resendTimer}s)` : 'Resend code'}
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  otpInputFilled: {
    borderColor: '#9A89FF',
    backgroundColor: '#F5F3FF',
  },
  otpInputError: {
    borderColor: '#FF6B6B',
  },
  resendText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  resendTextDisabled: {
    opacity: 0.5,
  },
})