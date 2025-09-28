import { CalendarEvent } from '../types/calendar';

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(2025, 0, 20, 9, 0), // Jan 20, 2025, 9:00 AM
    end: new Date(2025, 0, 20, 10, 30),
    color: '#FF3B30',
    description: 'Weekly team sync meeting'
  },
  {
    id: '2',
    title: 'Doctor Appointment',
    start: new Date(2025, 0, 20, 14, 30), // Jan 20, 2025, 2:30 PM
    end: new Date(2025, 0, 20, 15, 30),
    color: '#34C759',
    description: 'Annual checkup'
  },
  {
    id: '3',
    title: 'Lunch with Sarah',
    start: new Date(2025, 0, 21, 12, 0), // Jan 21, 2025, 12:00 PM
    end: new Date(2025, 0, 21, 13, 30),
    color: '#007AFF',
    description: 'Catch up over lunch'
  },
  {
    id: '4',
    title: 'Project Review',
    start: new Date(2025, 0, 22, 16, 0), // Jan 22, 2025, 4:00 PM
    end: new Date(2025, 0, 22, 17, 0),
    color: '#FF9500',
    description: 'Q1 project milestone review'
  },
  {
    id: '5',
    title: 'Gym Session',
    start: new Date(2025, 0, 23, 7, 0), // Jan 23, 2025, 7:00 AM
    end: new Date(2025, 0, 23, 8, 30),
    color: '#FF2D92',
    description: 'Morning workout'
  },
  {
    id: '6',
    title: 'Client Call',
    start: new Date(2025, 0, 24, 10, 0), // Jan 24, 2025, 10:00 AM
    end: new Date(2025, 0, 24, 11, 0),
    color: '#5856D6',
    description: 'Quarterly business review'
  },
  {
    id: '7',
    title: 'Dentist Appointment',
    start: new Date(2025, 0, 27, 15, 0), // Jan 27, 2025, 3:00 PM
    end: new Date(2025, 0, 27, 16, 0),
    color: '#34C759',
    description: 'Routine cleaning'
  },
  {
    id: '8',
    title: 'Conference Call',
    start: new Date(2025, 1, 3, 14, 0), // Feb 3, 2025, 2:00 PM
    end: new Date(2025, 1, 3, 15, 30),
    color: '#FF3B30',
    description: 'Monthly all-hands meeting'
  },
  {
    id: '9',
    title: 'Birthday Party',
    start: new Date(2025, 1, 14, 18, 0), // Feb 14, 2025, 6:00 PM
    end: new Date(2025, 1, 14, 22, 0),
    color: '#FF2D92',
    description: "John's birthday celebration"
  },
  {
    id: '10',
    title: 'Workshop',
    start: new Date(2025, 2, 15, 9, 0), // Mar 15, 2025, 9:00 AM
    end: new Date(2025, 2, 15, 17, 0),
    color: '#007AFF',
    description: 'React Native development workshop'
  }
];