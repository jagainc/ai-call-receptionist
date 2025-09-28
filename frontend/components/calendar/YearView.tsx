import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeIn,
  SlideInDown,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { CalendarEvent } from '../../types/calendar';
import { getEventsForMonth, getMonthName } from '../../utils/calendarUtils';

interface YearViewProps {
  year: number;
  events: CalendarEvent[];
  onMonthPress: (year: number, month: number) => void;
  onPrevYear?: () => void;
  onNextYear?: () => void;
  onYearJump?: (year: number) => void;
}

const { width } = Dimensions.get('window');
const MONTH_WIDTH = (width - 80) / 3; // 3 months per row with more spacing to prevent overlap
const MONTH_HEIGHT = MONTH_WIDTH * 1.35; // Taller aspect ratio to fit calendar content properly

export const YearView: React.FC<YearViewProps> = ({
  year,
  events,
  onMonthPress,
  onPrevYear,
  onNextYear,
  onYearJump
}) => {
  const [showYearInput, setShowYearInput] = useState(false);
  const [yearInputValue, setYearInputValue] = useState(year.toString());

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryText = useThemeColor({}, 'primaryText');
  const secondaryText = useThemeColor({}, 'secondaryText');
  const tertiaryText = useThemeColor({}, 'tertiaryText');
  const tint = useThemeColor({}, 'tint');
  const destructive = useThemeColor({}, 'destructive');
  const border = useThemeColor({}, 'border');
  const renderMiniMonth = (month: number) => {
    const monthEvents = getEventsForMonth(events, year, month);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Animation values for each month
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const hasEvents = monthEvents.some(event =>
        event.start.getDate() === day
      );

      days.push(
        <View key={day} style={styles.miniDay}>
          <Text style={[styles.miniDayText, hasEvents && styles.miniDayWithEvents]}>
            {day}
          </Text>
          {hasEvents && <Animated.View style={[styles.miniEventDot]} />}
        </View>
      );
    }

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const handlePress = () => {
      // Smooth press animation
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
      opacity.value = withTiming(0.8, { duration: 100 });

      setTimeout(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        opacity.value = withTiming(1, { duration: 150 });
        onMonthPress(year, month);
      }, 100);
    };

    return (
      <Animated.View
        key={month}
        style={[animatedStyle]}
        entering={FadeIn.delay(month * 50).duration(400).springify()}
      >
        <TouchableOpacity
          style={styles.miniMonth}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <Text style={styles.miniMonthName}>{getMonthName(month)}</Text>
          <View style={styles.miniCalendar}>
            <View style={styles.miniWeekDays}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.miniWeekDay}>{day}</Text>
              ))}
            </View>
            <View style={styles.miniDaysGrid}>
              {days}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderMonthsGrid = () => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      months.push(renderMiniMonth(month));
    }

    const rows = [];
    for (let i = 0; i < months.length; i += 3) {
      rows.push(
        <View key={i} style={styles.monthRow}>
          {months.slice(i, i + 3)}
        </View>
      );
    }

    return rows;
  };

  const handleYearInputSubmit = () => {
    const targetYear = parseInt(yearInputValue);
    if (!isNaN(targetYear) && targetYear >= 1 && targetYear <= 9999) {
      onYearJump?.(targetYear);
      setShowYearInput(false);
    } else {
      Alert.alert('Invalid Year', 'Please enter a year between 1 and 9999');
    }
  };

  const handleQuickJump = (targetYear: number) => {
    onYearJump?.(targetYear);
  };

  // Dynamic styles based on theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    yearNavigation: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    navButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    navButtonText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: primaryText,
    },
    yearTitleContainer: {
      alignItems: 'center',
    },
    yearTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: primaryText,
    },
    yearHint: {
      fontSize: 12,
      color: secondaryText,
      marginTop: 2,
    },
    yearInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      paddingHorizontal: 20,
    },
    yearInput: {
      flex: 1,
      height: 40,
      backgroundColor: cardBackground,
      borderRadius: 8,
      paddingHorizontal: 12,
      color: primaryText,
      fontSize: 16,
      marginRight: 10,
    },
    jumpButton: {
      backgroundColor: tint,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    jumpButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    quickJumpContainer: {
      marginTop: 15,
      alignItems: 'center',
    },
    quickJumpLabel: {
      fontSize: 14,
      color: secondaryText,
      marginBottom: 8,
    },
    quickJumpButtons: {
      flexDirection: 'row',
      gap: 10,
    },
    quickJumpButton: {
      backgroundColor: cardBackground,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    quickJumpButtonText: {
      color: primaryText,
      fontSize: 12,
      fontWeight: '500',
    },
    monthsContainer: {
      paddingHorizontal: 25,
      paddingBottom: 20,
    },
    monthRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      paddingHorizontal: 0,
    },
    miniMonth: {
      width: MONTH_WIDTH,
      height: MONTH_HEIGHT,
      backgroundColor: `${cardBackground}CC`, // Semi-transparent background for glass effect
      borderRadius: 16,
      padding: 12,
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: `${border}40`, // Subtle border with transparency
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      // Glass effect backdrop blur simulation
      backdropFilter: 'blur(10px)',
    },
    miniMonthName: {
      fontSize: 16,
      fontWeight: '600',
      color: primaryText,
      textAlign: 'center',
      marginBottom: 8,
      textShadowColor: `${primaryText}20`,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    miniCalendar: {
      flex: 1,
      justifyContent: 'space-between',
    },
    miniWeekDays: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 4,
    },
    miniWeekDay: {
      fontSize: 9,
      color: secondaryText,
      fontWeight: '500',
      width: 12,
      textAlign: 'center',
    },
    miniDaysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      minHeight: 90, // Increased height to accommodate 6 rows properly
      maxHeight: 90, // Prevent overflow
      overflow: 'hidden',
    },
    miniDay: {
      width: 12,
      height: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 1,
      position: 'relative',
    },
    emptyDay: {
      width: 12,
      height: 12,
      marginBottom: 1,
    },
    miniDayText: {
      fontSize: 7,
      color: primaryText,
      fontWeight: '400',
    },
    miniDayWithEvents: {
      fontWeight: '600',
    },
    miniEventDot: {
      width: 2,
      height: 2,
      borderRadius: 1,
      backgroundColor: destructive,
      position: 'absolute',
      bottom: -1,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.yearNavigation}>
          {onPrevYear && (
            <Animated.View entering={FadeIn.delay(100).springify()}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={onPrevYear}
                activeOpacity={0.7}
              >
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <Animated.View
            entering={FadeIn.delay(200).springify()}
            style={styles.yearTitleContainer}
          >
            <TouchableOpacity
              onPress={() => setShowYearInput(!showYearInput)}
              activeOpacity={0.8}
            >
              <Text style={styles.yearTitle}>{year}</Text>
              <Text style={styles.yearHint}>Tap to jump</Text>
            </TouchableOpacity>
          </Animated.View>

          {onNextYear && (
            <Animated.View entering={FadeIn.delay(300).springify()}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={onNextYear}
                activeOpacity={0.7}
              >
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {showYearInput && (
          <Animated.View
            style={styles.yearInputContainer}
            entering={SlideInDown.duration(300).springify()}
            exiting={SlideOutUp.duration(200)}
          >
            <TextInput
              style={styles.yearInput}
              value={yearInputValue}
              onChangeText={setYearInputValue}
              placeholder="Enter year (1-9999)"
              placeholderTextColor={secondaryText}
              keyboardType="numeric"
              maxLength={4}
              onSubmitEditing={handleYearInputSubmit}
              autoFocus
            />
            <TouchableOpacity
              style={styles.jumpButton}
              onPress={handleYearInputSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.jumpButtonText}>Go</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View
          style={styles.quickJumpContainer}
          entering={FadeIn.delay(400).duration(500).springify()}
        >
          <Text style={styles.quickJumpLabel}>Quick Jump:</Text>
          <View style={styles.quickJumpButtons}>
            {[2000, 2050, 2100, 3000].map((jumpYear, index) => (
              <Animated.View
                key={jumpYear}
                entering={SlideInDown.delay(500 + index * 100).springify()}
              >
                <TouchableOpacity
                  style={styles.quickJumpButton}
                  onPress={() => handleQuickJump(jumpYear)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickJumpButtonText}>{jumpYear}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </View>
      <View style={styles.monthsContainer}>
        {renderMonthsGrid()}
      </View>
    </ScrollView>
  );
};