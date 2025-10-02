#!/bin/bash

# AI Call Receptionist - One-Click Setup
echo "🚀 Setting up AI Call Receptionist..."

# Fix npm permissions
echo "🔧 Fixing permissions..."
sudo chown -R $(whoami) ~/.npm 2>/dev/null || true

# Install Expo CLI
echo "📦 Installing Expo CLI..."
sudo npm install -g @expo/cli

# Navigate to frontend
if [ -d "frontend" ]; then
    cd frontend
elif [ -d "ai-call-receptionist/frontend" ]; then
    cd ai-call-receptionist/frontend
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "✅ Setup complete!"
echo "🚀 Run: npx expo start"