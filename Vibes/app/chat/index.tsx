import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Image,
    Platform,
    KeyboardAvoidingView,
    SafeAreaViewBase,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Chat {
    id: string;
    username: string;
    lastMessage: string;
    timestamp: string;
    profilePicture: string;
    isOnline: boolean;
}

// Placeholder data
const CHATS_DATA: Chat[] = [
    {
        id: '1',
        username: 'Sarah Johnson',
        lastMessage: 'That sounds amazing! 🎉',
        timestamp: '2 min ago',
        profilePicture: 'https://i.pravatar.cc/150?img=1',
        isOnline: true,
    },
    {
        id: '2',
        username: 'Mike Chen',
        lastMessage: 'See you at the event tomorrow',
        timestamp: '15 min ago',
        profilePicture: 'https://i.pravatar.cc/150?img=2',
        isOnline: true,
    },
    {
        id: '3',
        username: 'Emily Davis',
        lastMessage: 'Thanks for the recommendation! 💙',
        timestamp: '1 hour ago',
        profilePicture: 'https://i.pravatar.cc/150?img=3',
        isOnline: false,
    },
    {
        id: '4',
        username: 'Alex Rivera',
        lastMessage: 'Catch up soon!',
        timestamp: '3 hours ago',
        profilePicture: 'https://i.pravatar.cc/150?img=4',
        isOnline: false,
    },
    {
        id: '5',
        username: 'Jordan Wilson',
        lastMessage: 'Can you send me the file?',
        timestamp: 'Yesterday',
        profilePicture: 'https://i.pravatar.cc/150?img=5',
        isOnline: true,
    },
];

export default function ChatsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter chats based on search query
    const filteredChats = useMemo(() => {
        return CHATS_DATA.filter((chat) =>
            chat.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleChatPress = (chatId: string) => {
        router.push(`/chat/${chatId}` as any);
    };

    const renderChatItem = ({ item }: { item: Chat }) => (
        <TouchableOpacity
            style={[styles.chatItem]}
            onPress={() => handleChatPress(item.id)}
            activeOpacity={0.7}
        >
            {/* Profile Picture with Online Status */}
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: item.profilePicture }}
                    style={styles.profilePicture}
                />
                {item.isOnline && <View style={styles.onlineIndicator} />}
            </View>

            {/* Chat Info */}
            <View style={styles.chatContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.username}>
                        {item.username}
                    </Text>
                    <Text style={styles.timestamp}>
                        {item.timestamp}
                    </Text>
                </View>
                <Text
                    style={styles.lastMessage}
                    numberOfLines={1}
                >
                    {item.lastMessage}
                </Text>
            </View>

            {/* Chevron */}
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#f6cae1ff', '#e5e5f9']}
                style={styles.gradientBackground}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Messages</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search chats..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Chat List */}
                {filteredChats.length > 0 ? (
                    <FlatList
                        data={filteredChats}
                        renderItem={renderChatItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        scrollIndicatorInsets={{ right: 1 }}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyText}>
                            No chats found
                        </Text>
                    </View>
                )}
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 12,
        color: '#333',
    },
    listContent: {
        paddingVertical: 8,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        gap: 12,
    },
    profileContainer: {
        position: 'relative',
    },
    profilePicture: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#e0e0e0',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#31a24c',
        borderWidth: 3,
        borderColor: '#fff',
    },
    chatContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    timestamp: {
        fontSize: 13,
        marginLeft: 8,
        color: '#999',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#999',
    },
});
