import OnboardingDots from '@/components/OnboardingDots'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View } from 'react-native'

export default function _layout() {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }} />
        </View>
    )
}
