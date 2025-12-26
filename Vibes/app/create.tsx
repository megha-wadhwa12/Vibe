import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { createPost, extractTags } from '@/lib/createPosts'
import { auth } from '@/firebase/firebaseConfig'
import { useAppContext } from '@/contexts/AppContext'
import type { CreatePostStateType } from '@/contexts/AppContext';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export const MOOD_CONFIG = {
  happy: {
    id: 'happy',
    label: 'Happy',
    emoji: '💕',
    bgVariant: 'soft-pink',
  },
  creative: {
    id: 'creative',
    label: 'Creative',
    emoji: '✨',
    bgVariant: 'sunny-yellow',
  },
  dreamy: {
    id: 'dreamy',
    label: 'Dreamy',
    emoji: '☁️',
    bgVariant: 'sky-blue',
  },
  sad: {
    id: 'sad',
    label: 'Sad',
    emoji: '😢',
    bgVariant: 'lavender',
  },
  calm: {
    id: 'calm',
    label: 'Calm',
    emoji: '🌷',
    bgVariant: 'mint-green',
  },
  hopeful: {
    id: 'hopeful',
    label: 'Hopeful',
    emoji: '🌈',
    bgVariant: 'peach',
  },
  reflective: {
    id: 'reflective',
    label: 'Reflective',
    emoji: '🌙',
    bgVariant: 'midnight',
  },
  nostalgic: {
    id: 'nostalgic',
    label: 'Nostalgic',
    emoji: '🌸',
    bgVariant: 'rose',
  },
  free: {
    id: 'free',
    label: 'Free',
    emoji: '🦋',
    bgVariant: 'aqua',
  },
  flow: {
    id: 'flow',
    label: 'Flow',
    emoji: '🌊',
    bgVariant: 'deep-blue',
  },
} as const;

const backgroundColors = [
  '#FFE5E5', // Light pink
  '#E5F5FF', // Light blue
  '#E5FFE5', // Light green
  '#FFF5E5', // Light orange
  '#F5E5FF', // Light purple
  '#FFFFE5', // Light yellow
];

export default function Create() {
  const router = useRouter();

  const [isFocused, setIsFocused] = useState(false);

  const { postState, setPostState, profile } = useAppContext();

  const moods = Object.values(MOOD_CONFIG);

  const updatePost = <K extends keyof CreatePostStateType>(
    key: K,
    value: CreatePostStateType[K]
  ) => {
    setPostState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const scaleAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0);
  const uploadScale = useSharedValue(1);

  const containerRef = useRef<Animatable.View & View>(null);

  // Animated styles
  const postButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
      shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.2, 0.5]),
      shadowRadius: interpolate(glowAnim.value, [0, 1], [4, 12]),
    };
  });

  const uploadAreaStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: uploadScale.value }],
    };
  });

  const postPressStyle = () => {
    scaleAnim.value = withSpring(0.95, {}, () => {
      scaleAnim.value = withSpring(1);
    });
    glowAnim.value = withTiming(1, { duration: 200 }, () => {
      glowAnim.value = withTiming(0, { duration: 300 });
    });
  }

  const handlePostPress = async () => {
    postPressStyle();

    if (!postState.description.trim() || !profile) return;

    const user = auth.currentUser;
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const payload = {
      description: postState.description,
      mood: postState.mood,
      media: postState.media,
      tags: extractTags(postState.description),
      authorId: user.uid,
      authorUsername: profile?.username ?? 'anonymous',
    };

    try {

      const postId = await createPost(payload);

      Toast.show({
        type: 'success',
        text1: 'Vibe posted ✨',
        text2: 'Your vibe is now live',
        position: 'bottom',
      });

      resetPostState();

      setTimeout(() => {
        router.replace('/home');
      }, 800);
    } catch (error) {
      console.error('Failed to post vibe:', error);
    }
  };

  const resetPostState = () => {
    setPostState({
      mood: 'creative',
      description: '',
      media: null,
      song: null,
    });
  };

  const handleUploadPress = () => {
    if (postState.media?.type === 'image') return;

    uploadScale.value = withSpring(0.98, {}, () => {
      uploadScale.value = withSpring(1);
    });
    pickImage();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      updatePost('media', {
        type: 'image',
        value: result.assets[0].uri,
      });
    }
  };

  const handleColorSelect = (color: string) => {
    updatePost('media', {
      type: 'background',
      value: color,
    });
  };


  const handleFeelingSelect = (moodID: string) => {
    updatePost('mood', moodID);
  };

  React.useEffect(() => {
    containerRef.current?.fadeInUp?.(800);
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
          duration={800}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create a Vibe</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                // Handle close/navigation back
              }}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Main Card */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              {/* Upload Section */}
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
                style={styles.uploadSection}
              >
                <Animated.View style={[styles.uploadArea, uploadAreaStyle]}>
                  <TouchableOpacity
                    style={styles.uploadTouchable}
                    onPress={handleUploadPress}
                    activeOpacity={0.8}
                  >
                    {postState.media?.type === 'image' ? (
                      <Image
                        source={{ uri: postState.media.value }}
                        style={styles.uploadedImage}
                        resizeMode="cover"
                      />
                    ) : postState.media?.type === 'background' ? (
                      <View
                        style={[
                          styles.colorPreview,
                          { backgroundColor: postState.media.value },
                        ]}
                      />
                    ) : (
                      <>
                        <Ionicons
                          name="cloud-upload-outline"
                          size={40}
                          color="#FFB6C1"
                        />
                        <Text style={styles.uploadText}>Upload an image</Text>
                        <Text style={styles.uploadSubtext}>
                          or choose a background color
                        </Text>
                        <TouchableOpacity
                          style={styles.browseButton}
                          onPress={handleUploadPress}
                        >
                          <Text style={styles.browseButtonText}>Browse files</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                {postState.media?.type !== 'image' && (
                  <View style={styles.colorPicker}>
                    {backgroundColors.map((color) => {
                      const isSelected =
                        postState.media?.type === 'background' &&
                        postState.media.value === color;

                      return (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            {
                              backgroundColor: color,
                              borderWidth: isSelected ? 3 : 1,
                              borderColor: isSelected ? '#FF6B9D' : '#E0E0E0',
                            },
                          ]}
                          onPress={() => handleColorSelect(color)}
                        >
                          {isSelected && (
                            <Ionicons name="checkmark" size={16} color="#FF6B9D" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </Animatable.View>

              {/* Quote Input */}
              <Animatable.View
                animation="fadeInUp"
                delay={200}
                style={styles.inputSection}
              >
                <TextInput
                  style={[
                    styles.quoteInput,
                    isFocused && styles.quoteInputFocused,
                  ]}
                  placeholder="Add a quote or thought..."
                  placeholderTextColor="#B0B0B0"
                  multiline
                  numberOfLines={4}
                  value={postState.description}
                  onChangeText={(text) => updatePost('description', text)}

                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </Animatable.View>

              {/* Add Song Button */}
              <Animatable.View
                animation="fadeInUp"
                delay={300}
                style={styles.songSection}
              >
                <TouchableOpacity
                  style={styles.songButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="musical-notes" size={24} color="#FF6B9D" />
                  <Text style={styles.songButtonText}>Add a song</Text>
                </TouchableOpacity>
              </Animatable.View>

              {/* Feeling Section */}
              <Animatable.View
                animation="fadeInUp"
                delay={400}
                style={styles.feelingSection}
              >
                <Text style={styles.feelingTitle}>How are you feeling?</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.emojiScroll}
                  style={styles.emojiContainer}
                >
                  {moods.map((mood, index) => {
                    const isSelected = postState.mood === mood.id;
                    return (
                      <Animatable.View
                        key={mood.id}
                        animation="zoomIn"
                        delay={500 + index * 50}
                      >
                        <TouchableOpacity
                          style={[
                            styles.emojiButton,
                            isSelected && styles.emojiButtonSelected,
                          ]}
                          onPress={() => handleFeelingSelect(mood.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.emoji}>{mood.emoji}</Text>
                          {isSelected && (
                            <Animatable.View
                              animation="pulse"
                              iterationCount="infinite"
                              style={styles.selectedIndicator}
                            />
                          )}
                        </TouchableOpacity>
                      </Animatable.View>
                    );
                  })}
                </ScrollView>
              </Animatable.View>

              {/* Post Button */}
              <Animatable.View
                animation="fadeInUp"
                delay={600}
                style={styles.postButtonContainer}
              >
                <Animated.View style={postButtonStyle}>
                  <TouchableOpacity
                    style={styles.postButton}
                    onPress={handlePostPress}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#FFB347', '#FFA500']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.postButtonGradient}
                    >
                      <Text style={styles.postButtonText}>Post Vibe</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </Animatable.View>
            </View>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
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
  uploadSection: {
    marginBottom: 20,
  },
  uploadArea: {
    backgroundColor: '#FFF0F5',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FFB6C1',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    marginBottom: 12,
  },
  uploadTouchable: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  colorPreview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B9D',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  inputSection: {
    marginBottom: 20,
  },
  quoteInput: {
    backgroundColor: '#FFF0F5',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quoteInputFocused: {
    borderColor: '#FFB6C1',
    backgroundColor: '#FFFFFF',
  },
  songSection: {
    marginBottom: 24,
  },
  songButton: {
    backgroundColor: '#FFF0F5',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  songButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  feelingSection: {
    marginBottom: 24,
  },
  feelingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  emojiContainer: {
    marginHorizontal: -4,
  },
  emojiScroll: {
    paddingHorizontal: 4,
    gap: 12,
  },
  emojiButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  emojiButtonSelected: {
    backgroundColor: '#FFF5E5',
    borderColor: '#FFB347',
    borderWidth: 3,
  },
  emoji: {
    fontSize: 28,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFB347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonContainer: {
    marginTop: 8,
  },
  postButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FFB347',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  postButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
