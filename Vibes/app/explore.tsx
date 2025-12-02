import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 cards per row with padding

interface VibeCard {
  id: string;
  type: 'image' | 'text';
  content: string;
  hashtags: string[];
  imageUrl?: string;
  category?: string;
}

const categories = [
  'Trending',
  'Calm',
  'Joyful ✨',
  'Reflective',
  'Adventure',
  'Aesthetic',
  'Serene',
  'Inspiring',
];

const exploreVibes: VibeCard[] = [
  {
    id: '1',
    type: 'image',
    content: '',
    hashtags: ['#cozy', '#peaceful'],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    category: 'Calm',
  },
  {
    id: '2',
    type: 'image',
    content: '',
    hashtags: ['#serene', '#calm'],
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
    category: 'Serene',
  },
  {
    id: '3',
    type: 'image',
    content: '',
    hashtags: ['#dreamy', '#nostalgic'],
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    category: 'Reflective',
  },
  {
    id: '4',
    type: 'image',
    content: '',
    hashtags: ['#aesthetic'],
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    category: 'Aesthetic',
  },
  {
    id: '5',
    type: 'text',
    content: '"The future belongs to those who believe in the beauty of their dreams."',
    hashtags: ['#inspirational'],
    category: 'Inspiring',
  },
  {
    id: '6',
    type: 'text',
    content: '"And into the forest I go, to lose my mind and find my soul."',
    hashtags: ['#adventure'],
    category: 'Adventure',
  },
  {
    id: '7',
    type: 'image',
    content: '',
    hashtags: ['#joyful', '#bright'],
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    category: 'Joyful ✨',
  },
  {
    id: '8',
    type: 'text',
    content: '"Every moment is a fresh beginning."',
    hashtags: ['#inspiring', '#motivational'],
    category: 'Inspiring',
  },
  {
    id: '9',
    type: 'image',
    content: '',
    hashtags: ['#serene', '#peaceful'],
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
    category: 'Serene',
  },
  {
    id: '10',
    type: 'image',
    content: '',
    hashtags: ['#aesthetic', '#dreamy'],
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    category: 'Aesthetic',
  },
  {
    id: '11',
    type: 'text',
    content: '"Life is a journey, not a destination."',
    hashtags: ['#adventure', '#inspiring'],
    category: 'Adventure',
  },
  {
    id: '12',
    type: 'image',
    content: '',
    hashtags: ['#calm', '#peaceful'],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    category: 'Calm',
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
  '#joyful': '#FFD700',
  '#bright': '#90EE90',
  '#inspiring': '#FFB6C1',
  '#motivational': '#FFD700',
};

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVibes = exploreVibes.filter((vibe) => {
    if (selectedCategory === 'Trending') {
      return true; // Show all for Trending
    }
    return vibe.category === selectedCategory;
  });

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

        <TouchableOpacity style={styles.arrowButton}>
          <Ionicons name="arrow-forward" size={18} color="#666" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#f6cae1ff', '#e5e5f9']}
        style={styles.gradientBackground}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for vibes, moods, tags, or users"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              {selectedCategory === category ? (
                <LinearGradient
                  colors={['#df54d1ff', '#a243f5ff']}
                  style={styles.categoryChipActive}
                >
                  <Text style={styles.categoryChipTextActive}>{category}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>{category}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vibe Cards Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardsGrid}>
            {filteredVibes.map((vibe, index) => renderVibeCard(vibe, index))}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e8e0f5',
    marginRight: 8,
  },
  categoryChipActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  categoryChipTextActive: {
    color: '#fff',
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
    position: 'relative',
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
  arrowButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
