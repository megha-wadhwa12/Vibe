import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Message {
  id: string;
  text: string;
  isOutgoing: boolean;
  timestamp: string;
  showAvatar?: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  profilePicture: string;
  isOnline: boolean;
}

// Placeholder users data
const USERS_DATA: Record<string, ChatUser> = {
  '1': {
    id: '1',
    name: 'Sarah Johnson',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    isOnline: true,
  },
  '2': {
    id: '2',
    name: 'Mike Chen',
    profilePicture: 'https://i.pravatar.cc/150?img=2',
    isOnline: true,
  },
  '3': {
    id: '3',
    name: 'Emily Davis',
    profilePicture: 'https://i.pravatar.cc/150?img=3',
    isOnline: false,
  },
  '4': {
    id: '4',
    name: 'Alex Rivera',
    profilePicture: 'https://i.pravatar.cc/150?img=4',
    isOnline: false,
  },
  '5': {
    id: '5',
    name: 'Jordan Wilson',
    profilePicture: 'https://i.pravatar.cc/150?img=5',
    isOnline: true,
  },
};

const dummyMessages: Message[] = [
  {
    id: '1',
    text: "Hey! I saw your vibe post with the sunset, it was absolutely stunning! ✨",
    isOutgoing: false,
    timestamp: '10:30 AM',
    showAvatar: true,
  },
  {
    id: '2',
    text: "Thank you so much! I'm glad you liked it. The sky was magical that evening.",
    isOutgoing: true,
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    text: "It really was! It gave me such a serene feeling. Your whole profile is such a moodboard.",
    isOutgoing: false,
    timestamp: '10:32 AM',
  },
  {
    id: '4',
    text: "Aww, that's so sweet of you to say! That's the vibe I'm going for. 💕",
    isOutgoing: true,
    timestamp: '10:33 AM',
  },
  {
    id: '5',
    text: 'That sounds amazing! 🎉',
    isOutgoing: false,
    timestamp: '10:35 AM',
  },
];

export default function UserChat() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Get chat user data
  const chatUser = USERS_DATA[id as string] || USERS_DATA['1'];

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isOutgoing: true,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = message.isOutgoing ? false : (prevMessage?.isOutgoing !== false || index === 0);

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          message.isOutgoing ? styles.outgoingContainer : styles.incomingContainer,
        ]}
      >
        {!message.isOutgoing && showAvatar && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color="#8B4513" />
            </View>
            <View style={styles.onlineIndicator} />
          </View>
        )}
        {!message.isOutgoing && !showAvatar && <View style={styles.avatarSpacer} />}

        <View style={styles.messageWrapper}>
          {message.isOutgoing ? (
            <LinearGradient
              colors={['#df54d1ff', '#a243f5ff']}
              style={styles.outgoingBubble}
            >
              <Text style={styles.outgoingText}>{message.text}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.incomingBubble}>
              <Text style={styles.incomingText}>{message.text}</Text>
            </View>
          )}
          <Text
            style={[
              styles.timestamp,
              message.isOutgoing ? styles.timestampRight : styles.timestampLeft,
            ]}
          >
            {message.timestamp}
          </Text>
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.headerAvatarContainer}>
              <Image
                source={{ uri: chatUser.profilePicture }}
                style={styles.headerAvatar}
              />
              {chatUser.isOnline && <View style={styles.headerOnlineIndicator} />}
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerName}>{chatUser.name}</Text>
              <Text style={styles.headerStatus}>{chatUser.isOnline ? 'Online' : 'Offline'}</Text>
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Date Separator */}
          <View style={styles.dateSeparator}>
            <View style={styles.dateLine} />
            <Text style={styles.dateText}>Today</Text>
            <View style={styles.dateLine} />
          </View>

          {/* Messages */}
          {messages.map((message, index) => renderMessage(message, index))}
        </ScrollView>

        {/* Message Input Bar */}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={handleSend}
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
                disabled={!inputText.trim()}
              >
                <LinearGradient
                  colors={inputText.trim() ? ['#df54d1ff', '#a243f5ff'] : ['#cccccc', '#aaaaaa']}
                  style={styles.sendButtonGradient}
                >
                  <Ionicons name="paper-plane" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    gap: 10,
    alignContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    flex: 1,
  },
  headerAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D2B48C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTextContainer: {
    alignItems: 'flex-start',
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerStatus: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    marginHorizontal: 12,
    fontWeight: '500',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  incomingContainer: {
    justifyContent: 'flex-start',
  },
  outgoingContainer: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginRight: 8,
    position: 'relative',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D2B48C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarSpacer: {
    width: 32,
    marginRight: 8,
  },
  messageWrapper: {
    maxWidth: '75%',
  },
  incomingBubble: {
    backgroundColor: '#FFE5F0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  outgoingBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  incomingText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  outgoingText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  timestampLeft: {
    textAlign: 'left',
    paddingLeft: 4,
  },
  timestampRight: {
    textAlign: 'right',
    paddingRight: 4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
