import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '@/firebase/firebaseConfig';
import { useAppContext } from '@/contexts/AppContext';
import { updateUserProfile } from '@/lib/updateUserProfile';

const MAX_BIO_LENGTH = 150;

export default function EditProfile() {
  const router = useRouter();
  const { profile, setProfile } = useAppContext();
  const containerRef = useRef<Animatable.View & View>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveButtonScale = useSharedValue(1);
  const cancelButtonScale = useSharedValue(1);

  const saveButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: saveButtonScale.value }],
    };
  });

  const cancelButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cancelButtonScale.value }],
    };
  });

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setUsername((profile.username || '').replace('@', ''));
      setBio(profile.bio || '');
      setAvatar(profile.avatar || null);
    }
    containerRef.current?.fadeInUp?.(600);
  }, [profile]);

  const handleChangePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save changes.');
      return;
    }

    // Validation
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Validation Error', 'Last name is required.');
      return;
    }
    if (!username.trim()) {
      Alert.alert('Validation Error', 'Username is required.');
      return;
    }

    setIsSaving(true);
    saveButtonScale.value = withSpring(0.95, {}, () => {
      saveButtonScale.value = withSpring(1);
    });

    try {
      await updateUserProfile({
        uid: user.uid,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().replace('@', ''),
        bio: bio.trim(),
        avatar: avatar,
      });

      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          username: username.trim().replace('@', ''),
          bio: bio.trim(),
          avatar: avatar,
        });
      }

      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    cancelButtonScale.value = withSpring(0.95, {}, () => {
      cancelButtonScale.value = withSpring(1);
    });
    router.back();
  };

  const fallbackAvatar =
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200';
  const displayAvatar = avatar || profile?.avatar || fallbackAvatar;

  const bioCount = bio.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#E9D5FF', '#FCE7F3']}
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
            keyboardShouldPersistTaps="handled"
          >
            {/* Card */}
            <LinearGradient
              colors={['#FFFFFF', '#FFF5F8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={styles.headerSpacer} />
              </View>

              {/* Profile Picture Section */}
              <Animatable.View
                animation="fadeInUp"
                delay={100}
                style={styles.profilePictureSection}
              >
                <View style={styles.profileImageContainer}>
                  <Image
                    source={{ uri: displayAvatar }}
                    style={styles.profileImage}
                  />
                  <TouchableOpacity
                    style={styles.cameraIcon}
                    onPress={handleChangePhoto}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="camera" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={handleChangePhoto}
                  activeOpacity={0.7}
                >
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </Animatable.View>

              {/* Input Fields */}
              <View style={styles.inputsContainer}>
                {/* First Name */}
                <Animatable.View
                  animation="fadeInUp"
                  delay={200}
                  style={styles.inputGroup}
                >
                  <Text style={styles.label}>
                    FIRST NAME <Text style={styles.emoji}>✨</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter first name"
                    placeholderTextColor="#B0B0B0"
                  />
                </Animatable.View>

                {/* Last Name */}
                <Animatable.View
                  animation="fadeInUp"
                  delay={250}
                  style={styles.inputGroup}
                >
                  <Text style={styles.label}>
                    LAST NAME <Text style={styles.emoji}>🌸</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter last name"
                    placeholderTextColor="#B0B0B0"
                  />
                </Animatable.View>

                {/* Username */}
                <Animatable.View
                  animation="fadeInUp"
                  delay={300}
                  style={styles.inputGroup}
                >
                  <Text style={styles.label}>
                    USERNAME <Text style={styles.emoji}>☁️</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.usernameInput]}
                    value={`@${username}`}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/^@/, '').replace('@', '');
                      setUsername(cleaned);
                    }}
                    placeholder="@username"
                    placeholderTextColor="#B0B0B0"
                  />
                </Animatable.View>

                {/* Bio */}
                <Animatable.View
                  animation="fadeInUp"
                  delay={350}
                  style={styles.inputGroup}
                >
                  <View style={styles.bioHeader}>
                    <Text style={styles.label}>
                      BIO <Text style={styles.emoji}>💕</Text>
                    </Text>
                    <Text style={[styles.charCount, bioCount > MAX_BIO_LENGTH * 0.85 && styles.charCountWarning]}>
                      {bioCount}/{MAX_BIO_LENGTH}
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.bioInput]}
                    value={bio}
                    onChangeText={(text) => {
                      if (text.length <= MAX_BIO_LENGTH) {
                        setBio(text);
                      }
                    }}
                    placeholder="Tell us about yourself..."
                    placeholderTextColor="#B0B0B0"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </Animatable.View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                <Animatable.View
                  animation="fadeInUp"
                  delay={400}
                  style={styles.buttonContainer}
                >
                  <Animated.View style={saveButtonStyle}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSave}
                      disabled={isSaving}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={['#9333EA', '#EC4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveButtonGradient}
                      >
                        <Text style={styles.saveButtonText}>
                          Save Changes <Text style={styles.emoji}>✨</Text>
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                </Animatable.View>

                <Animatable.View
                  animation="fadeInUp"
                  delay={450}
                  style={styles.buttonContainer}
                >
                  <Animated.View style={cancelButtonStyle}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancel}
                      disabled={isSaving}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </Animatable.View>
              </View>
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
    paddingBottom: 100,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  headerSpacer: {
    width: 32,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  changePhotoButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9333EA',
  },
  inputsContainer: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 0.5,
  },
  emoji: {
    fontSize: 14,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  usernameInput: {
    color: '#9333EA',
    fontWeight: '500',
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  charCountWarning: {
    color: '#EC4899',
    fontWeight: '600',
  },
  bioInput: {
    minHeight: 100,
    paddingTop: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  buttonContainer: {
    width: '100%',
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
});

