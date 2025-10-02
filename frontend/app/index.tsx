import { Redirect } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import SplashScreen from '@/components/ui/SplashScreen';
import { useAuth } from '@/hooks/useAuth';

// Keep the native splash screen visible while we fetch resources
ExpoSplashScreen.preventAutoHideAsync();

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [checkAuth, setCheckAuth] = useState(false);
  
  // Only start auth check after splash is done
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();

  useEffect(() => {
    // Hide the native splash screen immediately
    ExpoSplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    // Start auth check only after splash is finished
    if (checkAuth && !isLoading) {
      checkAuthStatus();
    }
  }, [checkAuth]);

  console.log('Index render:', { showSplash, checkAuth, isLoading, isAuthenticated });

  // Step 1: Show custom splash screen first
  if (showSplash) {
    console.log('Showing custom splash screen');
    return <SplashScreen onFinish={() => {
      console.log('Splash screen finished, starting auth check');
      setShowSplash(false);
      setCheckAuth(true);
    }} />;
  }

  // Step 2: Show loading while checking auth (only after splash)
  if (checkAuth && isLoading) {
    console.log('Checking authentication...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Checking authentication...</Text>
      </View>
    );
  }

  // Step 3: Redirect based on authentication status
  if (checkAuth && !isLoading) {
    if (isAuthenticated) {
      console.log('Redirecting to tabs');
      return <Redirect href="/(tabs)" />;
    } else {
      console.log('Redirecting to auth');
      return <Redirect href="/auth" />;
    }
  }

  // Fallback loading state
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: 'white', fontSize: 18 }}>Loading...</Text>
    </View>
  );
}