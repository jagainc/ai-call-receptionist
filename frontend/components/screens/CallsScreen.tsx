import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define the interface for call items
interface CallItem {
  id: string;
  name: string;
  time: string;
  type: 'mobile' | 'whatsapp';
  missed?: boolean;
  avatar?: string;
  initials?: string;
  count?: number;
}

// Sample data for calls with random names
const calls: CallItem[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    time: '7:08 PM',
    type: 'mobile',
    avatar: 'https://i.pravatar.cc/50?img=1',
  },
  {
    id: '2',
    name: 'Sarah❤️',
    time: '6:04 PM',
    type: 'mobile',
    initials: 'S',
    count: 4,
  },
  {
    id: '3',
    name: 'Matthew Davis',
    time: '5:13 PM',
    type: 'mobile',
    avatar: 'https://i.pravatar.cc/50?img=2',
    count: 2,
  },
  {
    id: '4',
    name: 'Emily Wilson',
    time: '10:04 AM',
    type: 'mobile',
    initials: 'EW',
  },
  {
    id: '5',
    name: 'James Miller',
    time: '10:04 AM',
    type: 'mobile',
    initials: 'JM',
    count: 2,
  },
  {
    id: '6',
    name: 'Lisa Chen',
    time: '9:57 AM',
    type: 'whatsapp',
    avatar: 'https://i.pravatar.cc/50?img=3',
  },
  {
    id: '7',
    name: 'David Brown',
    time: '9:45 AM',
    type: 'mobile',
    avatar: 'https://i.pravatar.cc/50?img=4',
    count: 2,
  },
  {
    id: '8',
    name: 'Rachel Green',
    time: '8:25 AM',
    type: 'mobile',
    initials: 'RG',
  },
  {
    id: '9',
    name: 'Michael Scott',
    time: '7:30 AM',
    type: 'mobile',
    initials: 'MS',
    missed: true,
  },
  {
    id: '10',
    name: 'Jennifer Lopez',
    time: '6:15 AM',
    type: 'mobile',
    initials: 'JL',
    missed: true,
  },
  {
    id: '11',
    name: 'Tom Wilson',
    time: 'Yesterday',
    type: 'mobile',
    avatar: 'https://i.pravatar.cc/50?img=5',
    missed: true,
  },
];

export default function CallsScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'missed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Theme-aware colors
  const colors = {
    background: isDark ? '#000000' : '#FFFFFF',
    statusBar: isDark ? '#000000' : '#F2F2F7',
    statusText: isDark ? '#FFFFFF' : '#000000',
    primaryText: isDark ? '#FFFFFF' : '#000000',
    secondaryText: isDark ? '#8E8E93' : '#6D6D70',
    tabContainer: isDark ? '#2C2C2E' : '#E5E5EA',
    activeTab: isDark ? '#48484A' : '#FFFFFF',
    inactiveTabText: isDark ? '#8E8E93' : '#6D6D70',
    activeTabText: isDark ? '#FFFFFF' : '#000000',
    searchBar: isDark ? '#2C2C2E' : '#F2F2F7',
    searchText: isDark ? '#FFFFFF' : '#000000',
    searchPlaceholder: isDark ? '#8E8E93' : '#6D6D70',
    initialsAvatar: isDark ? '#48484A' : '#E5E5EA',
    initialsText: isDark ? '#FFFFFF' : '#000000',
    bottomTabBar: isDark ? '#1C1C1E' : '#F2F2F7',
    tabBarBorder: isDark ? '#2C2C2E' : '#C6C6C8',
    homeIndicator: isDark ? '#FFFFFF' : '#000000',
    callIcon: isDark ? '#8E8E93' : '#6D6D70',
  };

  // Filter calls based on active tab and search query
  const filteredCalls = calls.filter(call => {
    // Filter by tab (all or missed)
    const matchesTab = activeTab === 'all' || (activeTab === 'missed' && call.missed);

    // Filter by search query
    const matchesSearch = searchQuery === '' ||
      call.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const renderCallItem = ({ item }: { item: CallItem }) => (
    <TouchableOpacity style={styles.callItem}>
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.initialsAvatar, { backgroundColor: colors.initialsAvatar }]}>
            <Text style={[styles.initialsText, { color: colors.initialsText }]}>{item.initials}</Text>
          </View>
        )}
      </View>

      <View style={styles.callInfo}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.primaryText }, item.missed && styles.missedName]}>
            {item.name} {item.count && `(${item.count})`}
          </Text>
          <Text style={[styles.time, { color: colors.secondaryText }]}>{item.time}</Text>
        </View>
        <View style={styles.callDetails}>
          <Ionicons
            name="call"
            size={14}
            color={colors.callIcon}
            style={styles.callIcon}
          />
          <Text style={[styles.callType, { color: colors.secondaryText }]}>
            {item.type === 'whatsapp' ? 'WhatsApp Audio' : 'mobile'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.infoButton}>
        <Ionicons name="information-circle" size={22} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: 60 }]}>
        <TouchableOpacity>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>

        <View style={[styles.tabContainer, { backgroundColor: colors.tabContainer }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && { backgroundColor: colors.activeTab }]}
            onPress={() => {
              setActiveTab('all');
              setSearchQuery(''); // Clear search when switching tabs
            }}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === 'all' ? colors.activeTabText : colors.inactiveTabText }
            ]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'missed' && { backgroundColor: colors.activeTab }]}
            onPress={() => {
              setActiveTab('missed');
              setSearchQuery(''); // Clear search when switching tabs
            }}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === 'missed' ? colors.activeTabText : colors.inactiveTabText }
            ]}>Missed</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recents Title */}
      <Text style={[styles.recentsTitle, { color: colors.primaryText }]}>Recents</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.searchBar }]}>
          <Ionicons name="search" size={18} color={colors.searchPlaceholder} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.searchText }]}
            placeholder="Search"
            placeholderTextColor={colors.searchPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity>
            <Ionicons name="mic" size={18} color={colors.searchPlaceholder} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Call List */}
      <FlatList
        data={filteredCalls}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              {activeTab === 'missed'
                ? searchQuery
                  ? 'No missed calls found'
                  : 'No missed calls'
                : searchQuery
                  ? 'No calls found'
                  : 'No recent calls'
              }
            </Text>
          </View>
        )}
      />

      {/* Bottom Tab Bar */}
      <View style={[styles.bottomTabBar, { backgroundColor: colors.bottomTabBar, borderTopColor: colors.tabBarBorder }]}>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="star" size={24} color={colors.secondaryText} />
          <Text style={[styles.tabBarLabel, { color: colors.secondaryText }]}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="time" size={24} color="#007AFF" />
          <Text style={[styles.tabBarLabel, styles.activeTabBarLabel]}>Recents</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="person-circle" size={24} color={colors.secondaryText} />
          <Text style={[styles.tabBarLabel, { color: colors.secondaryText }]}>Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="grid" size={24} color={colors.secondaryText} />
          <Text style={[styles.tabBarLabel, { color: colors.secondaryText }]}>Keypad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="radio" size={24} color={colors.secondaryText} />
          <Text style={[styles.tabBarLabel, { color: colors.secondaryText }]}>Voicemail</Text>
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      <View style={[styles.homeIndicator, { backgroundColor: colors.homeIndicator }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  editButton: {
    color: '#007AFF',
    fontSize: 17,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  recentsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  initialsAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 16,
    fontWeight: '500',
  },
  callInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '400',
  },
  missedName: {
    color: '#FF3B30',
  },
  time: {
    fontSize: 15,
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIcon: {
    marginRight: 4,
  },
  callType: {
    fontSize: 14,
  },
  infoButton: {
    padding: 8,
  },
  bottomTabBar: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabBarLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  activeTabBarLabel: {
    color: '#007AFF',
  },
  homeIndicator: {
    height: 4,
    width: 134,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});