import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'onboardingSeen';

export async function setOnboardingSeen() {
  await AsyncStorage.setItem(KEY, 'true');
}

export async function hasSeenOnboarding(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEY);
  return value === 'true';
}