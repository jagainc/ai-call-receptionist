import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Create custom theme based on our color system
  const customTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: Colors[colorScheme ?? 'light'].tint,
      background: Colors[colorScheme ?? 'light'].background,
      card: Colors[colorScheme ?? 'light'].cardBackground,
      text: Colors[colorScheme ?? 'light'].primaryText,
      border: Colors[colorScheme ?? 'light'].border,
    },
  };

  return (
    <ThemeProvider value={customTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="schedule-calls" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="book-appointment" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="customize-agent" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="talk-to-agent" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="add-schedule-call" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="test-auth" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}