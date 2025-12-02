import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import BottomNavigation from '@/components/BottomNavigation';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  // Show bottom navigation only on main app pages (not onboarding/auth/index)
  const showBottomNav = 
    pathname === '/home' ||
    pathname === '/explore' ||
    pathname === '/create' ||
    pathname === '/chat' ||
    pathname === '/profile';

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
        {showBottomNav && (
          <View style={styles.bottomNavContainer}>
            <BottomNavigation />
          </View>
        )}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
