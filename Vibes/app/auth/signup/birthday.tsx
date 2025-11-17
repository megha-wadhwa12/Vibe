import { View, Text } from 'react-native'
import React from 'react'
import OnboardingDots from '@/components/OnboardingDots'

export default function birthday() {
  return (
    <View>
      <Text>birthday</Text>
      <OnboardingDots total={4} current={2} />
    </View>
  )
}