import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabBarBackground() {
  const insets = useSafeAreaInsets();
  
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webBackground, { paddingBottom: insets.bottom }]} />
    );
  }

  return (
    <View style={styles.container}>
      {/* Levitating shadow effect */}
      <View style={[styles.shadowContainer, { paddingBottom: insets.bottom }]} />
      
      {/* Main liquid glass blur effect */}
      <BlurView
        intensity={100}
        tint="systemUltraThinMaterialLight"
        style={[styles.blurContainer, { paddingBottom: insets.bottom }]}
      />
      
      {/* Glass overlay for liquid effect */}
      <View style={[styles.glassOverlay, { paddingBottom: insets.bottom }]} />
      
      {/* Subtle border for definition */}
      <View style={styles.borderLine} />
      
      {/* Inner highlight for glass effect */}
      <View style={[styles.innerHighlight, { paddingBottom: insets.bottom }]} />
    </View>
  );
}

export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -20,
    left: 20,
    right: 20,
    bottom: 30,
    borderRadius: 32,
    overflow: 'hidden',
  },
  shadowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 25,
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 32,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 32,
  },
  borderLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 32,
  },
  innerHighlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  webBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(30px) saturate(200%)',
    borderRadius: 32,
    margin: 20,
    marginBottom: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
  },
});
