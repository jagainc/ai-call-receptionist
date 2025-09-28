# AI Call Receptionist - Frontend

React Native Expo application for the AI Call Receptionist system.

## Project Structure

```
frontend/
├── app/              # Expo Router pages
├── components/       # Reusable UI components
│   ├── common/      # Common UI components
│   ├── screens/     # Screen components
│   ├── ui/          # UI-specific components
│   └── navigation/  # Navigation components
├── constants/        # App constants and themes
├── hooks/           # Custom React hooks
├── assets/          # Images, fonts, and static assets
├── scripts/         # Build and utility scripts
└── package.json     # Dependencies and scripts
```

## Features

- 🏠 **Automation Hub** - Central dashboard for quick actions
- 📞 **Call Management** - Advanced call history with search and filtering
- 📅 **Appointment Scheduling** - Calendar integration for bookings
- 🤖 **AI Agent Integration** - Voice chat with Kijo assistant
- 🎨 **Modern UI** - Glass morphism design with light/dark themes
- 📱 **Cross-platform** - iOS, Android, and Web support

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platforms:
   ```bash
   npm run android    # Android device/emulator
   npm run ios        # iOS device/simulator
   npm run web        # Web browser
   ```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **React Navigation** for advanced routing
- **Expo Vector Icons** for iconography
- **React Native Reanimated** for animations

## Design System

- Glass morphism UI effects with BlurView
- Comprehensive theming (light/dark modes)
- Haptic feedback integration
- Platform-specific optimizations
- Rich black theme for dark mode

## Development

This project uses:
- File-based routing with Expo Router
- TypeScript strict mode
- ESLint for code quality
- Custom theming system with `useAppColors` hook
- Modular component architecture

## Project Status

### Implemented ✅
- Home screen with dashboard and quick actions
- Calls screen with search, filtering, and realistic data
- Navigation system with tab and stack routing
- Comprehensive theming and styling system
- Glass morphism UI effects

### In Progress 🔄
- Schedule calls functionality
- Book appointment feature
- Agent customization
- Voice chat with agent
- Calendar/appointments screen
- Profile screen
- Backend API integration

## Contributing

1. Make your changes
2. Test on multiple platforms
3. Run linting: `npm run lint`
4. Submit a pull request

## License

MIT License