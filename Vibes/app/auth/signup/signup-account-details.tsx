import { View, Text } from 'react-native'
import React from 'react'
import OnboardingDots from '@/components/OnboardingDots'

export default function AccountDetails() {
  return (
    <View>
      <Text>account-details</Text>
                  <OnboardingDots total={4} current={1}/>
    </View>
  )
}