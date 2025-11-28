import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View } from 'react-native'
import { SignupProvider } from '@/contexts/SignupContext'

export default function _layout() {
    return (
        <SignupProvider>
            <View style={{ flex: 1 }}>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false }} />
            </View>
        </SignupProvider>
    )
}
