import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState(
    pathname === '/home' ? 'home' : pathname.replace('/', '') || 'home'
  );

  useEffect(() => {
    const currentTab = pathname === '/home' ? 'home' : pathname.replace('/', '') || 'home';
    setSelectedTab(currentTab);
  }, [pathname]);

  const handleTabPress = (tab: string, route: string) => {
    setSelectedTab(tab);
    router.push(route as any);
  };

  return (
    <LinearGradient
      colors={['#f1c7ddff', '#e5e5f9']}
      style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('home', '/home')}
      >
        <Ionicons
          name="home"
          size={24}
          color={selectedTab === 'home' ? '#df54d1ff' : '#a243f5a8'}
        />
        <Text
          style={[
            styles.navLabel,
            selectedTab === 'home' && styles.navLabelActive,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('explore', '/explore')}
      >
        <Ionicons
          name="compass"
          size={24}
          color={selectedTab === 'explore' ? '#df54d1ff' : '#a243f5a8'}
        />
        <Text
          style={[
            styles.navLabel,
            selectedTab === 'explore' && styles.navLabelActive,
          ]}
        >
          Explore
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('create', '/create')}
      >
        <Ionicons
          name="add-circle"
          size={24}
          color={selectedTab === 'create' ? '#df54d1ff' : '#a243f5a8'}
        />
        <Text
          style={[
            styles.navLabel,
            selectedTab === 'create' && styles.navLabelActive,
          ]}
        >
          Create
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('chat', '/chat')}
      >
        <Ionicons
          name="chatbubbles"
          size={24}
          color={selectedTab === 'chat' ? '#df54d1ff' : '#a243f5a8'}
        />
        <Text
          style={[
            styles.navLabel,
            selectedTab === 'chat' && styles.navLabelActive,
          ]}
        >
          Chat
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('profile', '/profile')}
      >
        <Ionicons
          name="person"
          size={24}
          color={selectedTab === 'profile' ? '#df54d1ff' : '#a243f5a8'}
        />
        <Text
          style={[
            styles.navLabel,
            selectedTab === 'profile' && styles.navLabelActive,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 11,
    color: '#8918eca8',
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#df54d1ff',
    fontWeight: '700',
  },
});

