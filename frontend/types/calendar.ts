export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
}

export interface MarkedDate {
  marked: boolean;
  dotColor: string;
  selected?: boolean;
  selectedColor?: string;
}

export interface MarkedDates {
  [date: string]: MarkedDate;
}

export type CalendarView = 'year' | 'month' | 'day';