import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

interface OnboardingDotsProps {
    total: number;
    current: number;
}

export default function OnboardingDots({ total, current }: OnboardingDotsProps) {
    const router = useRouter();

    const screens = [
        '/onboarding/screen1',
        '/onboarding/screen2',
        '/onboarding/screen3',
        '/onboarding/screen4',
    ] as const;

    const handleDotPress = (index: number) => {
        router.push(screens[index]);
    }

    return (
        <View style={styles.container}>
            {[Array.from({ length: total }).map((_, index) => (
                <Pressable
                    key={index}
                    onPress={() => handleDotPress(index)}
                    style={[styles.dot, index === current && styles.activeDot]}>

                </Pressable>
            ))]}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40, // distance from bottom
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: '#ccc',
    },
    activeDot: {
        backgroundColor: '#333',
        // width: 10,
        // height: 10,
    }
})