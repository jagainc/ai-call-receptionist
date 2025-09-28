import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

interface ScheduleItem {
  id: string;
  personName: string;
  reason: string;
  time: string;
  date: string;
  status: 'upcoming' | 'completed' | 'missed';
}

const initialScheduleData: ScheduleItem[] = [
  {
    id: '1',
    personName: 'Board Member - Robert Smith',
    reason: 'Be formal, discuss Q4 financials, mention cost reduction initiatives',
    time: '2:30 PM',
    date: 'Today',
    status: 'upcoming',
  },
  {
    id: '2',
    personName: 'Client - Tech Startup CEO',
    reason: 'Casual tone, focus on scalability solutions, avoid technical jargon',
    time: '4:00 PM',
    date: 'Today',
    status: 'upcoming',
  },
  {
    id: '3',
    personName: 'Investor - Maria Garcia',
    reason: 'Professional but friendly, highlight ROI metrics, prepare market data',
    time: '10:00 AM',
    date: 'Yesterday',
    status: 'completed',
  },
  {
    id: '4',
    personName: 'Partner - John Wilson',
    reason: 'Collaborative approach, discuss partnership terms, be open to negotiations',
    time: '3:15 PM',
    date: 'Yesterday',
    status: 'missed',
  },
  {
    id: '5',
    personName: 'Team Lead - Sarah Chen',
    reason: 'Supportive tone, review project milestones, address team concerns',
    time: '11:30 AM',
    date: 'Dec 18',
    status: 'completed',
  },
];

// Global state for schedule items (in a real app, you'd use Context, Redux, or AsyncStorage)
let globalScheduleData = [...initialScheduleData];

export const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
  const newItem: ScheduleItem = {
    ...item,
    id: Date.now().toString(),
  };
  globalScheduleData.unshift(newItem); // Add to beginning of array
};

export default function ScheduleCallsScreen() {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>(globalScheduleData);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setScheduleData([...globalScheduleData]);
    }, [])
  );

  const colors = {
    background: isDark ? '#000000' : '#FFFFFF',
    primaryText: isDark ? '#FFFFFF' : '#000000',
    secondaryText: isDark ? '#8E8E93' : '#666666',
    border: isDark ? '#2C2C2E' : '#E5E5E5',
    cardBackground: isDark ? '#1C1C1E' : '#F8F9FA',
    plusButton: '#007AFF',
    upcoming: '#34C759',
    completed: '#8E8E93',
    missed: '#FF3B30',
  };

  const getStatusColor = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'upcoming':
        return colors.upcoming;
      case 'completed':
        return colors.completed;
      case 'missed':
        return colors.missed;
      default:
        return colors.secondaryText;
    }
  };

  const renderScheduleItem = ({ item }: { item: ScheduleItem }) => (
    <TouchableOpacity style={[styles.scheduleCard, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.personName, { color: colors.primaryText }]}>
            {item.personName}
          </Text>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: colors.secondaryText }]}>
              {item.time}
            </Text>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          </View>
        </View>

        <View style={styles.aiInstructionsContainer}>
          <View style={styles.aiLabel}>
            <Ionicons name="sparkles" size={14} color={colors.plusButton} />
            <Text style={[styles.aiLabelText, { color: colors.plusButton }]}>AI Instructions</Text>
          </View>
          <Text style={[styles.reason, { color: colors.secondaryText }]}>
            {item.reason}
          </Text>
        </View>

        <Text style={[styles.dateText, { color: colors.secondaryText }]}>
          {item.date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: colors.background,
        borderBottomColor: colors.border
      }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.primaryText }]}>
          Schedule Calls
        </Text>

        <TouchableOpacity 
          style={[styles.plusButton, { backgroundColor: colors.plusButton }]}
          onPress={() => router.push('/add-schedule-call')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Schedule Feed */}
      <FlatList
        data={scheduleData}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.secondaryText} />
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              No scheduled calls yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.secondaryText }]}>
              Tap the + button to schedule your first call
            </Text>
          </View>
        )}
      />

      {/* Bottom padding for tab bar */}
      <View style={styles.bottomPadding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  scheduleCard: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  aiInstructionsContainer: {
    marginBottom: 8,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiLabelText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  reason: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 120,
  },
});