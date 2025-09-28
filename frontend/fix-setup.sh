#!/bin/bash

echo "🔧 Fixing React Native project setup..."

# Clear npm cache
echo "📦 Clearing npm cache..."
npm cache clean --force

# Remove node_modules and package-lock.json
echo "🗑️  Removing node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies with legacy peer deps to handle React 19
echo "📥 Installing dependencies..."
npm install --legacy-peer-deps

# Clear Metro and Expo cache
echo "🧹 Clearing caches..."
npx expo start --clear

echo "✅ Setup complete! Try running your app now."
echo "💡 If you still get errors, try: npx expo install --fix"