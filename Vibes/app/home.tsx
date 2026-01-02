import React, { useEffect } from 'react';
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
import { getPosts } from '@/lib/getPosts';
import { PostMedia, useAppContext } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface VibeCard {
  authorId: string;
  authorUsername: string;
  createdAt: string;
  description: string;
  tags: string[];
  mood: string;
  media: PostMedia
}

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

  const { posts, setPosts, loading, setLoading } = useAppContext()

  const renderVibeCard = (vibe: VibeCard, index: number) => {
    const isImage = vibe.media?.type === 'image'
    return (
      <View key={index} style={styles.vibeCard}>
        {isImage ? (
          <Image
            source={{ uri: vibe.media?.value }}
            style={styles.vibeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[
            styles.textCard,
            { backgroundColor: vibe.media?.value || '#F5E5FF' },
          ]}>
            <Text style={styles.quoteText}>{vibe.description}</Text>
          </View>
        )}

        <View style={styles.hashtagContainer}>
          {vibe.tags.map((tag, tagIndex) => (
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
          <View style={{ display: 'flex', flexDirection: 'row' }}>
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
            {posts.map((vibe: VibeCard, index: number) => renderVibeCard(vibe, index))}
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
    // backgroundColor: '#fff',
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
