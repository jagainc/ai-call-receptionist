#!/bin/bash

echo "🔧 Fixing React 19 compatibility issues..."

# Clear all caches
echo "🧹 Clearing all caches..."
npm cache clean --force
rm -rf node_modules
rm -f package-lock.json
rm -rf .expo
rm -rf /tmp/metro-*

# Install dependencies with proper flags for React 19
echo "📥 Installing dependencies with React 19 support..."
npm install --legacy-peer-deps

# Use Expo's install command to fix any version mismatches
echo "🔧 Running Expo install to fix version mismatches..."
npx expo install --fix

# Clear Metro bundler cache
echo "🧹 Clearing Metro cache..."
npx expo start --clear --reset-cache

echo "✅ React 19 setup complete!"
echo ""
echo "🚀 To start your app:"
echo "   npx expo start"
echo ""
echo "💡 If you still get HostFunction errors:"
echo "   1. Make sure you're using a physical device or updated simulator"
echo "   2. Try: npx expo start --dev-client"
echo "   3. Check that all native dependencies are properly linked"