import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import { useAppColors } from '@/hooks/useAppColors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  action: () => void;
}

interface RecentActivity {
  id: string;
  title: string;
  time: string;
  type: 'call' | 'appointment' | 'automation';
}

const quickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Schedule Call',
    subtitle: 'Quick call setup',
    icon: 'call',
    color: '#34C759',
    action: () => router.push('/schedule-calls'),
  },
  {
    id: '2',
    title: 'Book Appointment',
    subtitle: 'New appointment',
    icon: 'calendar',
    color: '#007AFF',
    action: () => router.push('/book-appointment'),
  },
  {
    id: '3',
    title: 'customize agent',
    subtitle: 'Set up automation',
    icon: 'person',
    color: '#FF9500',
    action: () => router.push('/customize-agent'),
  },
  {
    id: '4',
    title: 'Talk to your agent',
    subtitle: 'Kijo',
    icon: 'mic',
    color: '#5856D6',
    action: () => router.push('/talk-to-agent'),
  },
];

const recentActivities: RecentActivity[] = [
  // TODO: Replace with backend API call
  // This is placeholder data - will be fetched from backend
  {
    id: 'placeholder-1',
    title: 'Loading recent activities...',
    time: 'Fetching data',
    type: 'call',
  },
  {
    id: 'placeholder-2',
    title: 'Recent call activity will appear here',
    time: 'From backend',
    type: 'automation',
  },
  {
    id: 'placeholder-3',
    title: 'Connect to backend to see real data',
    time: 'API integration needed',
    type: 'appointment',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { colors } = useAppColors();

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'call':
        return 'call';
      case 'appointment':
        return 'calendar';
      case 'automation':
        return 'cog';
      default:
        return 'information-circle';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Automation Hub</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.secondaryText }]}>
          Streamline your calls and appointments
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section} lightColor="transparent" darkColor="transparent">
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Quick Actions
        </ThemedText>
        <ThemedView style={styles.actionsGrid} lightColor="transparent" darkColor="transparent">
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={action.action}
            >
              <View style={styles.glassCard}>
                <BlurView
                  intensity={Platform.OS === 'web' ? 0 : 20}
                  tint={colorScheme === 'dark' ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight'}
                  style={styles.blurBackground}
                />
                <View style={[styles.glassOverlay, { backgroundColor: colors.glassOverlay, borderColor: colors.glassBorder }]} />
                <View style={styles.cardContent}>
                  <ThemedView style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <Ionicons name={action.icon} size={24} color="white" />
                  </ThemedView>
                  <ThemedText style={styles.actionTitle}>{action.title}</ThemedText>
                  <ThemedText style={[styles.actionSubtitle, { color: colors.secondaryText }]}>{action.subtitle}</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section} lightColor="transparent" darkColor="transparent">
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Activity
        </ThemedText>
        <View style={styles.activityList}>
          <BlurView
            intensity={Platform.OS === 'web' ? 0 : 15}
            tint={colorScheme === 'dark' ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight'}
            style={styles.blurBackground}
          />
          <View style={[styles.glassOverlay, { backgroundColor: colors.glassOverlay, borderColor: colors.glassBorder }]} />
          <View style={styles.listContent}>
            {recentActivities.map((activity) => (
              <ThemedView key={activity.id} style={[styles.activityItem, { borderBottomColor: colors.border }]} lightColor="transparent" darkColor="transparent">
                <ThemedView style={[styles.activityIcon, { backgroundColor: colors.secondaryBackground }]}>
                  <Ionicons
                    name={getActivityIcon(activity.type)}
                    size={20}
                    color={colors.icon}
                  />
                </ThemedView>
                <ThemedView style={styles.activityContent} lightColor="transparent" darkColor="transparent">
                  <ThemedText style={styles.activityTitle}>{activity.title}</ThemedText>
                  <ThemedText style={[styles.activityTime, { color: colors.secondaryText }]}>{activity.time}</ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.section} lightColor="transparent" darkColor="transparent">
        <View style={styles.statsCard}>
          <BlurView
            intensity={Platform.OS === 'web' ? 0 : 15}
            tint={colorScheme === 'dark' ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight'}
            style={styles.blurBackground}
          />
          <View style={[styles.glassOverlay, { backgroundColor: colors.glassOverlay, borderColor: colors.glassBorder }]} />
          <View style={styles.statsContent}>
            <ThemedText type="subtitle" style={styles.statsTitle}>
              Today's Summary
            </ThemedText>
            <ThemedView style={styles.statsRow} lightColor="transparent" darkColor="transparent">
              <ThemedView style={styles.statItem} lightColor="transparent" darkColor="transparent">
                <ThemedText style={[styles.statNumber, { color: colors.primaryText }]}>5</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.secondaryText }]}>Calls</ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem} lightColor="transparent" darkColor="transparent">
                <ThemedText style={[styles.statNumber, { color: colors.primaryText }]}>3</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.secondaryText }]}>Appointments</ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem} lightColor="transparent" darkColor="transparent">
                <ThemedText style={[styles.statNumber, { color: colors.primaryText }]}>12</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.secondaryText }]}>Automations</ThemedText>
              </ThemedView>
            </ThemedView>
          </View>
        </View>
      </ThemedView>

      {/* Bottom padding for floating navigation */}
      <ThemedView style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  glassCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderRadius: 20,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18,
  },
  actionSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
    opacity: 0.8,
  },
  activityList: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  listContent: {
    position: 'relative',
    zIndex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
  },
  statsCard: {
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  statsContent: {
    padding: 24,
    position: 'relative',
    zIndex: 1,
  },
  statsTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 6,
    lineHeight: 36,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  bottomPadding: {
    height: 120,
    backgroundColor: 'transparent',
  },
});