# AI Call Receptionist - Setup Guide

## Quick Setup (5 minutes)

### Step 1: Install Node.js
1. Go to **https://nodejs.org/**
2. Download and install the LTS version
3. Restart Terminal

### Step 2: Fix npm permissions (if needed)
```bash
sudo chown -R $(whoami) ~/.npm
```

### Step 3: Install Expo CLI
```bash
sudo npm install -g @expo/cli
```

### Step 4: Install project dependencies
```bash
cd ai-call-receptionist/frontend
npm install --legacy-peer-deps
```

### Step 5: Start the app
```bash
npx expo start
```

### Step 6: Test on your phone
1. Install **Expo Go** app from App Store/Play Store
2. Scan the QR code from Terminal
3. Your app will load on your phone!

## That's it! 🎉

Your AI Call Receptionist app is now running on your phone through Expo Go.

## Troubleshooting

**Permission errors?**
```bash
sudo chown -R $(whoami) ~/.npm
```

**React 19 compatibility issues?**
```bash
npm install --legacy-peer-deps
```

**QR code not working?**
```bash
npx expo start --tunnel
```

## System Requirements
- Mac/Windows/Linux
- Node.js 18+
- 2GB free space
- Phone with Expo Go app