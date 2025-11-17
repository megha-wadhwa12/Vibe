import { View, Text } from 'react-native'
import React from 'react'
import OnboardingDots from '@/components/OnboardingDots'

export default function verification() {
  return (
    <View>
      <Text>verification</Text>
      <OnboardingDots total={4} current={3} />
      
    </View>
  )
}