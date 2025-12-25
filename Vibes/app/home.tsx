import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface VibeCard {
  id: string;
  type: 'image' | 'text';
  content: string;
  hashtags: string[];
  imageUrl?: string;
}

const dummyVibes: VibeCard[] = [
  {
    id: '1',
    type: 'image',
    content: '',
    hashtags: ['#dreamy', '#nostalgic'],
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    id: '2',
    type: 'image',
    content: '',
    hashtags: ['#serene', '#calm'],
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
  },
  {
    id: '3',
    type: 'text',
    content: '"The future belongs to those who believe in the beauty of their dreams."',
    hashtags: ['#inspirational'],
  },
  {
    id: '4',
    type: 'text',
    content: '"And into the forest I go, to lose my mind and find my soul."',
    hashtags: ['#adventure'],
  },
  {
    id: '5',
    type: 'image',
    content: '',
    hashtags: ['#cozy', '#peaceful'],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
  },
  {
    id: '6',
    type: 'image',
    content: '',
    hashtags: ['#aesthetic'],
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
  },
  {
    id: '7',
    type: 'image',
    content: '',
    hashtags: ['#cozy', '#peaceful'],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
  },
  {
    id: '8',
    type: 'image',
    content: '',
    hashtags: ['#aesthetic'],
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
  },
  {
    id: '9',
    type: 'image',
    content: '',
    hashtags: ['#cozy', '#peaceful'],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
  },
  {
    id: '10',
    type: 'image',
    content: '',
    hashtags: ['#aesthetic'],
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
  },
];

const hashtagColors: { [key: string]: string } = {
  '#dreamy': '#FFD700',
  '#nostalgic': '#90EE90',
  '#serene': '#FFD700',
  '#calm': '#90EE90',
  '#inspirational': '#FFB6C1',
  '#adventure': '#90EE90',
  '#cozy': '#90EE90',
  '#peaceful': '#FFA500',
  '#aesthetic': '#FFB6C1',
};

export default function Home() {


  const renderVibeCard = (vibe: VibeCard, index: number) => {
    return (
      <View key={vibe.id} style={styles.vibeCard}>
        {vibe.type === 'image' && vibe.imageUrl ? (
          <Image
            source={{ uri: vibe.imageUrl }}
            style={styles.vibeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.textCard}>
            <Text style={styles.quoteText}>{vibe.content}</Text>
          </View>
        )}

        <View style={styles.hashtagContainer}>
          {vibe.hashtags.map((tag, tagIndex) => (
            <View
              key={tagIndex}
              style={[
                styles.hashtagChip,
                { backgroundColor: hashtagColors[tag] || '#FFB6C1' },
              ]}
            >
              <Text style={styles.hashtagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.reactionBar}>
          <TouchableOpacity style={styles.reactionButton}>
            <Ionicons name="heart-outline" size={20} color="#FFD700" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionButton}>
            <Ionicons name="repeat-outline" size={20} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionButton}>
            <Ionicons name="sparkles-outline" size={20} color="#FFD700" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionButton}>
            <Ionicons name="paper-plane-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#f6cae1ff', '#e5e5f9']}
        style={styles.gradientBackground}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={20} color="#8B4513" />
            </View>
          </View>

          <Text style={styles.title}>Vibe Board</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Vibe Cards Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardsGrid}>
            {dummyVibes.map((vibe, index) => renderVibeCard(vibe, index))}
          </View>
        </ScrollView>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D2B48C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    textShadowColor: '#8918ec5a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vibeCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  vibeImage: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#f0f0f0',
  },
  textCard: {
    width: '100%',
    minHeight: CARD_WIDTH,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 6,
  },
  hashtagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  hashtagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  reactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reactionButton: {
    padding: 4,
  },
  logoutBtn: {
    marginLeft: 30,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FFE5E5',
  },
  logoutText: {
    color: '#D11A2A',
    fontWeight: '600',
    textAlign: 'center',
  },
});
