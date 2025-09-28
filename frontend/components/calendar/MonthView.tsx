import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn, SlideInLeft } from 'react-native-reanimated';
import { CalendarEvent } from '../../types/calendar';
import { createMarkedDates, getMonthName } from '../../utils/calendarUtils';

interface MonthViewProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  selectedDate?: string;
  onDatePress: (dateString: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onBackToYear: () => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  year,
  month,
  events,
  selectedDate,
  onDatePress,
  onPrevMonth,
  onNextMonth,
  onBackToYear,
}) => {
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryText = useThemeColor({}, 'primaryText');
  const secondaryText = useThemeColor({}, 'secondaryText');
  const tint = useThemeColor({}, 'tint');

  const markedDates = createMarkedDates(events, selectedDate);
  const currentDateString = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;

  // Dynamic styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    backText: {
      fontSize: 17,
      color: tint,
      marginLeft: 4,
    },
    monthNavigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    navButton: {
      padding: 8,
    },
    monthTitle: {
      fontSize: 22,
      fontWeight: '600',
      color: primaryText,
    },
    calendar: {
      paddingHorizontal: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={styles.header}
        entering={FadeIn.duration(400).springify()}
      >
        <Animated.View entering={SlideInLeft.delay(100).springify()}>
          <TouchableOpacity
            onPress={onBackToYear}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={tint} />
            <Text style={styles.backText}>{year}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={styles.monthNavigation}
          entering={FadeIn.delay(200).springify()}
        >
          <TouchableOpacity
            onPress={onPrevMonth}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={primaryText} />
          </TouchableOpacity>

          <Animated.Text
            style={styles.monthTitle}
            entering={FadeIn.delay(300).springify()}
          >
            {getMonthName(month)} {year}
          </Animated.Text>

          <TouchableOpacity
            onPress={onNextMonth}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={20} color={primaryText} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(400).duration(500).springify()}>
        <Calendar
          current={currentDateString}
          markedDates={markedDates}
          onDayPress={(day) => onDatePress(day.dateString)}
          theme={{
            calendarBackground: backgroundColor,
            textSectionTitleColor: secondaryText,
            selectedDayBackgroundColor: tint,
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: tint,
            dayTextColor: primaryText,
            textDisabledColor: secondaryText,
            dotColor: tint,
            selectedDotColor: '#FFFFFF',
            arrowColor: tint,
            monthTextColor: primaryText,
            indicatorColor: tint,
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontWeight: '400',
            textMonthFontWeight: '600',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
          }}
          hideArrows={true}
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={0}
          showWeekNumbers={false}
          style={styles.calendar}
        />
      </Animated.View>
    </View>
  );
};