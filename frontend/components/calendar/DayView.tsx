import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CalendarEvent } from '../../types/calendar';
import { formatTime, formatTimeRange, getEventsForDate } from '../../utils/calendarUtils';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onBackToMonth: () => void;
}

const { height } = Dimensions.get('window');
const HOUR_HEIGHT = 60;

export const DayView: React.FC<DayViewProps> = ({ date, events, onBackToMonth }) => {
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryText = useThemeColor({}, 'primaryText');
  const secondaryText = useThemeColor({}, 'secondaryText');
  const tint = useThemeColor({}, 'tint');
  const border = useThemeColor({}, 'border');
  const destructive = useThemeColor({}, 'destructive');
  const success = useThemeColor({}, 'success');

  const dayEvents = getEventsForDate(events, date);

  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();

    const top = (startHour + startMinute / 60) * HOUR_HEIGHT;
    const duration = (endHour + endMinute / 60) - (startHour + startMinute / 60);
    const height = duration * HOUR_HEIGHT;

    return { top, height };
  };

  const handleEventPress = (event: CalendarEvent) => {
    Alert.alert(
      event.title,
      `${formatTimeRange(event.start, event.end)}\n\n${event.description || 'No description'}`,
      [{ text: 'OK' }]
    );
  };

  const renderHourlySlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const isCurrentHour = new Date().getHours() === hour &&
        new Date().toDateString() === date.toDateString();

      slots.push(
        <View key={hour} style={styles.hourSlot}>
          <View style={styles.timeColumn}>
            <Text style={[styles.timeText, isCurrentHour && styles.currentTimeText]}>
              {timeString}
            </Text>
          </View>
          <View style={[styles.hourLine, isCurrentHour && styles.currentHourLine]} />
        </View>
      );
    }
    return slots;
  };

  const renderEvents = () => {
    return dayEvents.map((event) => {
      const { top, height } = getEventPosition(event);

      return (
        <TouchableOpacity
          key={event.id}
          style={[
            styles.eventBlock,
            {
              top,
              height: Math.max(height, 30), // Minimum height
              backgroundColor: event.color,
            },
          ]}
          onPress={() => handleEventPress(event)}
        >
          <Text style={styles.eventTitle} numberOfLines={1}>
            {event.title}
          </Text>
          <Text style={styles.eventTime} numberOfLines={1}>
            {formatTime(event.start)}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  // Dynamic styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 15,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    backText: {
      fontSize: 17,
      color: tint,
      marginLeft: 4,
    },
    dateTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: primaryText,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 50,
    },
    timelineContainer: {
      flex: 1,
      position: 'relative',
    },
    timeline: {
      paddingLeft: 20,
    },
    hourSlot: {
      height: HOUR_HEIGHT,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    timeColumn: {
      width: 60,
      paddingTop: 5,
    },
    timeText: {
      fontSize: 12,
      color: secondaryText,
      fontWeight: '500',
    },
    currentTimeText: {
      color: tint,
      fontWeight: '600',
    },
    hourLine: {
      flex: 1,
      height: 1,
      backgroundColor: border,
      marginTop: 8,
      marginRight: 20,
    },
    currentHourLine: {
      backgroundColor: tint,
      height: 2,
    },
    eventsContainer: {
      position: 'absolute',
      left: 80,
      right: 20,
      top: 0,
    },
    eventBlock: {
      position: 'absolute',
      left: 0,
      right: 0,
      borderRadius: 6,
      padding: 8,
      marginRight: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
    },
    eventTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 2,
    },
    eventTime: {
      fontSize: 11,
      color: '#FFFFFF',
      opacity: 0.9,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMonth} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={tint} />
          <Text style={styles.backText}>Month</Text>
        </TouchableOpacity>

        <Text style={styles.dateTitle}>{formatDateHeader(date)}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.timelineContainer}>
          <View style={styles.timeline}>
            {renderHourlySlots()}
          </View>
          <View style={styles.eventsContainer}>
            {renderEvents()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};