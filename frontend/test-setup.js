// Simple test to verify React and React Native setup
const React = require('react');

console.log('✅ React version:', React.version);
console.log('✅ React import successful');

// Test if we can import React Native components
try {
  const { View } = require('react-native');
  console.log('✅ React Native import successful');
} catch (error) {
  console.log('❌ React Native import failed:', error.message);
}

// Test Expo vector icons
try {
  const { Ionicons } = require('@expo/vector-icons');
  console.log('✅ Expo vector icons import successful');
} catch (error) {
  console.log('❌ Expo vector icons import failed:', error.message);
}

console.log('🎉 Basic setup verification complete!');