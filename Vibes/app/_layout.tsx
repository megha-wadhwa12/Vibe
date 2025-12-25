import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import BottomNavigation from '@/components/BottomNavigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { AppStateProvider } from '@/contexts/AppContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);

  const isAuthRoute =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/onboarding');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      // 🔓 Allow auth & signup routes freely
      if (isAuthRoute) {
        if (user && user.emailVerified) {
          router.replace('/home');
        }
        setAuthChecked(true);
        return;
      }

      if (!user) {
        router.replace('/auth/login/login-screen');
        setAuthChecked(true);
        return;
      }

      if (!user.emailVerified) {
        router.replace('/auth/signup/verification');
        setAuthChecked(true);
        return;
      }

      setAuthChecked(true);
    });

    return unsubscribe;
  }, [pathname]);


  if (!authChecked) {
    return null;
  }

  // Show bottom navigation only on main app pages (not onboarding/auth/index)
  const showBottomNav =
    pathname === '/home' ||
    pathname === '/explore' ||
    pathname === '/create' ||
    pathname === '/chat' ||
    pathname === '/profile';

  return (
    <ThemeProvider value={DefaultTheme}>
      <AppStateProvider>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }} />
          {showBottomNav && (
            <View style={styles.bottomNavContainer}>
              <BottomNavigation />
            </View>
          )}
        </View>
      </AppStateProvider>

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
