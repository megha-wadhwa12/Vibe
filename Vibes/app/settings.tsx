import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

interface SettingsItem {
  id: string;
  label: string;
  onPress?: () => void;
}

interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

const settingsSections: SettingsSection[] = [
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'edit-profile',
        label: 'Edit Profile',
        onPress: () => {
          router.push('/edit-profile' as any);
        },
      },
      {
        id: 'account-settings',
        label: 'Account Settings',
        onPress: () => {
          // Navigate to account settings
        },
      },
    ],
  },
  {
    id: 'content',
    title: 'Content & Activity',
    items: [
      {
        id: 'liked-posts',
        label: 'Liked Posts',
        onPress: () => {
          // Navigate to liked posts
        },
      },
      {
        id: 'saved-vibes',
        label: 'Saved Vibes',
        onPress: () => {
          // Navigate to saved vibes
        },
      },
    ],
  },
  {
    id: 'preferences',
    title: 'App Preferences',
    items: [
      {
        id: 'notifications',
        label: 'Notifications',
        onPress: () => {
          // Navigate to notifications
        },
      },
      {
        id: 'privacy',
        label: 'Privacy',
        onPress: () => {
          // Navigate to privacy
        },
      },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    items: [
      {
        id: 'help-support',
        label: 'Help & Support',
        onPress: () => {
          // Navigate to help & support
        },
      },
      {
        id: 'about',
        label: 'About Vibe',
        onPress: () => {
          // Navigate to about
        },
      },
      {
        id: 'privacy-policy',
        label: 'Privacy Policy',
        onPress: () => {
          // Navigate to privacy policy
        },
      },
    ],
  },
];

export default function Settings() {
  const router = useRouter();
  const containerRef = useRef<Animatable.View & View>(null);
  const logoutScale = useSharedValue(1);

  const logoutButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoutScale.value }],
    };
  });

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              logoutScale.value = withSpring(0.95, {}, () => {
                logoutScale.value = withSpring(1);
              });
              await signOut(auth);
              router.replace('/auth/login/login-screen');
            } catch (error) {
              console.error('Logout failed', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleItemPress = (item: SettingsItem) => {
    if (item.onPress) {
      item.onPress();
    }
  };

  React.useEffect(() => {
    containerRef.current?.fadeInUp?.(600);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#f6cae1ff', '#e5e5f9']}
        style={styles.gradientBackground}
      >
        <Animatable.View
          ref={containerRef}
          style={styles.content}
          animation="fadeInUp"
          duration={600}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Settings Card */}
            <LinearGradient
              colors={['#FFFFFF', '#FFF5F8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
              </View>

              {/* Settings Sections */}
              {settingsSections.map((section, sectionIndex) => (
                <Animatable.View
                  key={section.id}
                  animation="fadeInUp"
                  delay={100 + sectionIndex * 100}
                  style={styles.section}
                >
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <View style={styles.itemsContainer}>
                    {section.items.map((item, itemIndex) => (
                      <Animatable.View
                        key={item.id}
                        animation="fadeInRight"
                        delay={150 + sectionIndex * 100 + itemIndex * 50}
                      >
                        <TouchableOpacity
                          style={styles.settingsItem}
                          onPress={() => handleItemPress(item)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.itemLabel}>{item.label}</Text>
                          <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                          />
                        </TouchableOpacity>
                      </Animatable.View>
                    ))}
                  </View>
                </Animatable.View>
              ))}

              {/* Logout Button */}
              <Animatable.View
                animation="fadeInUp"
                delay={600}
                style={styles.logoutSection}
              >
                <Animated.View style={logoutButtonStyle}>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animatable.View>
            </LinearGradient>
          </ScrollView>
        </Animatable.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  gradientBackground: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for potential bottom navigation
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#6B46C1', // Dark purple
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1', // Dark purple
    marginBottom: 12,
  },
  itemsContainer: {
    gap: 8,
  },
  settingsItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  logoutSection: {
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#E9D5FF', // Light purple
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D8B4FE',
    shadowColor: '#6B46C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1', // Dark purple
  },
});
