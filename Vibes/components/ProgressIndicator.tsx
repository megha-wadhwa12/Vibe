import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

interface progressIndicatorProps {
  total: number,
  current: number
}

export default function ProgressIndicator({ total, current }: progressIndicatorProps) {

  const router = useRouter();

  const screens = [
    '/auth/signup/basic-info',
    '/auth/signup/account-details',
    '/auth/signup/birthday',
    '/auth/signup/verification',
  ] as const;

  const handleBarPress = (index: number) => {
    router.push(screens[index])
  }

  return (
    <Pressable style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <Pressable
          key={index}
          onPress={() => handleBarPress(index)}
          style={[
            styles.dots,
            index === current && styles.activeBar,
          ]}
        />
      ))}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
    position: 'absolute',
    top: 100,
  },
  dots: {
    width: 6,
    height: 6,
    borderRadius: 50,
    backgroundColor: '#b69afdff'
  },
  activeBar: {
    backgroundColor: '#9e7efeff',
    width: 25,
    borderRadius: 12,
  }
})