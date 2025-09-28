import { CalendarEvent, MarkedDates } from '../types/calendar';

export const formatDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => isSameDay(event.start, date));
};

export const getEventsForMonth = (events: CalendarEvent[], year: number, month: number): CalendarEvent[] => {
  return events.filter(event => 
    event.start.getFullYear() === year && event.start.getMonth() === month
  );
};

export const createMarkedDates = (events: CalendarEvent[], selectedDate?: string): MarkedDates => {
  const marked: MarkedDates = {};
  
  events.forEach(event => {
    const dateString = formatDateString(event.start);
    if (!marked[dateString]) {
      marked[dateString] = {
        marked: true,
        dotColor: event.color,
      };
    }
  });

  if (selectedDate) {
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#FF3B30',
    };
  }

  return marked;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatTimeRange = (start: Date, end: Date): string => {
  return `${formatTime(start)} - ${formatTime(end)}`;
};

export const getMonthName = (month: number): string => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month];
};

export const getHourlySlots = (): string[] => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
};