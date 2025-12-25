import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
import { useAppContext } from '@/contexts/AppContext';
import { getUserProfile } from '@/lib/getUserProfile';
import { auth } from '@/firebase/firebaseConfig';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2; // 2 cards per row with padding

// Donut Chart Component
const DonutChart = ({ data }: { data: Array<{ label: string; value: number; color: string }> }) => {
  const size = 180;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.chartContainer}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const offset = currentOffset;
            currentOffset -= (percentage / 100) * circumference;

            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>
      <View style={styles.chartCenter}>
        <Text style={styles.chartTitle}>Weekly Moods</Text>
      </View>
    </View>
  );
};

// Dummy vibe images
const dummyVibes = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
  'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
  'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
];

// Mood data matching the screenshot
const moodData = [
  { label: 'Happy', value: 50, color: '#4CAF50' }, // Green
  { label: 'Creative', value: 20, color: '#FF9800' }, // Orange
  { label: 'Dreamy', value: 10, color: '#E91E63' }, // Pink
  { label: 'Calm', value: 5, color: '#9C27B0' }, // Purple
  { label: 'Nostalgic', value: 15, color: '#FF5722' }, // Reddish-orange
];

export default function Profile() {
  const router = useRouter();

  const { profile, setProfile, loading, setLoading } = useAppContext();

  useEffect(() => {
    const loadProfile = async () => {
      if (profile) return;
      try {

        setLoading(true)
        const user = auth.currentUser;
        if (!user) return;

        const data = await getUserProfile(user.uid);
        setProfile(data);
      } catch (e) {
        console.error('PROFILE FETCH ERROR:', e);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 40 }}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }
  const fallbackAvatar =
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200';

  const avatarUrl =
    profile && typeof profile.avatar === 'string' && profile.avatar.length > 0
      ? profile.avatar
      : fallbackAvatar;


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Settings Icon */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Vibe App Profile</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/settings' as any)}
          >
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {profile && (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.profileImage}
              />
            )}

          </View>
          <Text style={styles.profileName}>
            {profile?.firstName} {profile?.lastName}
          </Text>

          <Text style={styles.profileUsername}>
            @{profile?.username ?? 'user'}
          </Text>

          <Text style={styles.profileBio}>
            {profile?.bio || 'No bio yet'}
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={()=> router.push('/edit-profile')}>
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Connections</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mood Analytics Section */}
        <View style={styles.analyticsCard}>
          <Text style={styles.sectionTitle}>Mood Analytics</Text>
          <View style={styles.chartWrapper}>
            <DonutChart data={moodData} />
          </View>
          <View style={styles.legend}>
            {moodData.map((mood, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: mood.color }]} />
                <Text style={styles.legendText}>
                  {mood.label} ({mood.value}%)
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* My Vibes Section */}
        <View style={styles.vibesSection}>
          <Text style={styles.sectionTitle}>My Vibes</Text>
          <View style={styles.vibesGrid}>
            {dummyVibes.map((imageUri, index) => (
              <Pressable
                key={index}
                style={styles.vibeCard}
                onPress={() => {
                  // Handle press
                }}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.vibeImage}
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom navigation
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  settingsButton: {
    padding: 4,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  chartContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chartCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  legend: {
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  vibesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  vibeCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
  },
  vibeImage: {
    width: '100%',
    height: '100%',
  },
});
