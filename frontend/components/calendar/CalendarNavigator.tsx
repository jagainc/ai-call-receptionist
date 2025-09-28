import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { mockEvents } from '../../data/mockEvents';
import { CalendarEvent, CalendarView } from '../../types/calendar';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { YearView } from './YearView';

export const CalendarNavigator: React.FC = () => {
  const [currentView, setCurrentView] = useState<CalendarView>('year');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events] = useState<CalendarEvent[]>(mockEvents);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');

  // Animation values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  // Smooth transition helper
  const smoothTransition = (callback: () => void, direction: 'forward' | 'backward' = 'forward') => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Scale down and slide
    scale.value = withSpring(0.95, { damping: 20, stiffness: 300 });
    translateX.value = withTiming(direction === 'forward' ? -20 : 20, { duration: 150 });

    // Execute callback after animation
    setTimeout(() => {
      runOnJS(callback)();

      // Scale back up and slide back
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      translateX.value = withSpring(0, { damping: 20, stiffness: 300 });

      setTimeout(() => setIsTransitioning(false), 200);
    }, 150);
  };

  const handleMonthPress = (year: number, month: number) => {
    smoothTransition(() => {
      setCurrentYear(year);
      setCurrentMonth(month);
      setCurrentView('month');
    });
  };

  const handleDatePress = (dateString: string) => {
    smoothTransition(() => {
      setSelectedDate(dateString);
      setCurrentView('day');
    });
  };

  const handleBackToYear = () => {
    smoothTransition(() => {
      setCurrentView('year');
      setSelectedDate(null);
    }, 'backward');
  };

  const handleBackToMonth = () => {
    smoothTransition(() => {
      setCurrentView('month');
    }, 'backward');
  };

  const handlePrevMonth = () => {
    smoothTransition(() => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }, 'backward');
  };

  const handleNextMonth = () => {
    smoothTransition(() => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    });
  };

  const handlePrevYear = () => {
    smoothTransition(() => {
      setCurrentYear(currentYear - 1);
    }, 'backward');
  };

  const handleNextYear = () => {
    smoothTransition(() => {
      setCurrentYear(currentYear + 1);
    });
  };

  const handleYearJump = (targetYear: number) => {
    smoothTransition(() => {
      setCurrentYear(targetYear);
    });
  };

  const getSelectedDateObject = (): Date => {
    if (selectedDate) {
      return new Date(selectedDate);
    }
    return new Date();
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value }
    ],
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    animatedContainer: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        {currentView === 'year' && (
          <Animated.View
            entering={FadeIn.duration(300).springify()}
            exiting={FadeOut.duration(200)}
            style={{ flex: 1 }}
          >
            <YearView
              year={currentYear}
              events={events}
              onMonthPress={handleMonthPress}
              onPrevYear={handlePrevYear}
              onNextYear={handleNextYear}
              onYearJump={handleYearJump}
            />
          </Animated.View>
        )}

        {currentView === 'month' && (
          <Animated.View
            entering={SlideInRight.duration(400).springify()}
            exiting={SlideOutLeft.duration(300)}
            style={{ flex: 1 }}
          >
            <MonthView
              year={currentYear}
              month={currentMonth}
              events={events}
              selectedDate={selectedDate ?? undefined}
              onDatePress={handleDatePress}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onBackToYear={handleBackToYear}
            />
          </Animated.View>
        )}

        {currentView === 'day' && selectedDate && (
          <Animated.View
            entering={SlideInRight.duration(400).springify()}
            exiting={SlideOutRight.duration(300)}
            style={{ flex: 1 }}
          >
            <DayView
              date={getSelectedDateObject()}
              events={events}
              onBackToMonth={handleBackToMonth}
            />
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
};