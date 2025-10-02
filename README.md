# 🤖 AI Call Receptionist

A React Native mobile application that serves as your personal AI-powered call receptionist. Manage calls, schedule appointments, organize contacts, and let AI handle your communications intelligently.

## ✨ Features

- 🔐 **Secure Local Authentication** - Privacy-first user accounts with local data storage
- 📞 **Smart Call Management** - Schedule and organize calls with AI assistance
- 📅 **Appointment Scheduling** - Integrated calendar for managing your schedule
- 👥 **Contact Organization** - Manage contacts with roles, notes, and tags
- 🤖 **AI Agent Customization** - Personalize your AI assistant's behavior
- 📱 **Offline-First** - Works completely offline with local data storage
- 🎨 **Beautiful UI** - Modern, responsive design with dark/light themes

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-call-receptionist.git
   cd ai-call-receptionist
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator, `a` for Android emulator

## 📱 App Structure

```
ai-call-receptionist/
├── frontend/                 # React Native Expo app
│   ├── app/                 # App screens and navigation
│   ├── components/          # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── constants/          # App constants and themes
│   └── assets/             # Images, fonts, and static files
└── backend/                # Optional backend services
    ├── app/                # FastAPI application
    └── requirements.txt    # Python dependencies
```

## 🔐 Privacy & Security

- **Local-First Architecture**: All user data stays on your device
- **No Network Dependencies**: Works completely offline
- **Secure Authentication**: Password hashing with local session management
- **Privacy by Design**: No data collection or external tracking

## 🎨 Screenshots

[Add screenshots of your app here]

## 🛠️ Development

### Frontend Development

```bash
cd frontend
npm start                    # Start Expo development server
npm run android             # Run on Android
npm run ios                 # Run on iOS
npm run web                 # Run on web
```

### Code Structure

- **Authentication**: Local AsyncStorage-based auth system
- **Navigation**: Expo Router with type-safe routing
- **State Management**: React Context API
- **Styling**: StyleSheet with theme support
- **Data Storage**: AsyncStorage for local persistence

## 📋 Available Scripts

### Frontend
- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/)
- UI components inspired by modern mobile design patterns
- Icons by [Expo Vector Icons](https://icons.expo.fyi/)

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ for better call management**