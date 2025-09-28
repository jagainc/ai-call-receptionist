import { CalendarNavigator } from '@/components/calendar/CalendarNavigator';
import { ThemedText } from '@/components/common/ThemedText';
import { StyleSheet, View } from 'react-native';

export default function AppointmentsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Calendar
        </ThemedText>
      </View>
      <CalendarNavigator />
    </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});