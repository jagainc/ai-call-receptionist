import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
}

const DarkVeil: React.FC<DarkVeilProps> = ({
  hueShift = 0,
  noiseIntensity = 0.1,
  scanlineIntensity = 0.1,
  speed = 0.5,
  scanlineFrequency = 0.02,
  warpAmount = 0.05,
}) => {
  const { width, height } = Dimensions.get('window');
  
  // Animation values
  const time = useSharedValue(0);
  const waveOffset1 = useSharedValue(0);
  const waveOffset2 = useSharedValue(0);
  const colorShift = useSharedValue(0);

  useEffect(() => {
    // Main time animation
    time.value = withRepeat(
      withTiming(1, {
        duration: 10000 / speed,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Wave animations
    waveOffset1.value = withRepeat(
      withTiming(1, {
        duration: 8000 / speed,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    waveOffset2.value = withRepeat(
      withTiming(1, {
        duration: 12000 / speed,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    // Color shift animation
    colorShift.value = withRepeat(
      withTiming(1, {
        duration: 15000 / speed,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [speed]);

  // Animated gradient layers
  const backgroundStyle = useAnimatedStyle(() => {
    const hueRotation = interpolate(colorShift.value, [0, 1], [0, 360]);
    return {
      transform: [
        {
          rotate: `${hueRotation + hueShift}deg`,
        },
      ],
    };
  });

  const wave1Style = useAnimatedStyle(() => {
    const translateX = interpolate(waveOffset1.value, [0, 1], [-width * 0.5, width * 0.5]);
    const translateY = interpolate(time.value, [0, 1], [-height * 0.2, height * 0.2]);
    return {
      transform: [
        { translateX },
        { translateY },
        { scale: 1 + warpAmount * 0.5 },
      ],
      opacity: 0.6 + noiseIntensity * 0.4,
    };
  });

  const wave2Style = useAnimatedStyle(() => {
    const translateX = interpolate(waveOffset2.value, [0, 1], [width * 0.3, -width * 0.3]);
    const translateY = interpolate(time.value, [0, 1], [height * 0.1, -height * 0.1]);
    return {
      transform: [
        { translateX },
        { translateY },
        { scale: 1 + warpAmount * 0.3 },
      ],
      opacity: 0.4 + noiseIntensity * 0.6,
    };
  });

  const scanlineStyle = useAnimatedStyle(() => {
    const translateY = interpolate(time.value, [0, 1], [-height, height]);
    return {
      transform: [{ translateY }],
      opacity: scanlineIntensity,
    };
  });

  // Generate multiple gradient layers for complex visual effect
  const gradientColors1 = [
    'rgba(20, 0, 40, 0.9)',
    'rgba(40, 0, 80, 0.7)',
    'rgba(60, 20, 100, 0.8)',
    'rgba(80, 40, 120, 0.6)',
    'rgba(40, 0, 80, 0.9)',
  ];

  const gradientColors2 = [
    'rgba(0, 20, 60, 0.8)',
    'rgba(20, 40, 100, 0.6)',
    'rgba(40, 60, 140, 0.7)',
    'rgba(20, 40, 100, 0.5)',
    'rgba(0, 20, 60, 0.8)',
  ];

  const gradientColors3 = [
    'rgba(60, 0, 120, 0.4)',
    'rgba(100, 20, 160, 0.3)',
    'rgba(140, 40, 200, 0.4)',
    'rgba(100, 20, 160, 0.2)',
    'rgba(60, 0, 120, 0.4)',
  ];

  return (
    <View style={styles.container}>
      {/* Base dark background */}
      <View style={styles.baseBackground} />
      
      {/* Animated gradient layers */}
      <Animated.View style={[styles.gradientLayer, backgroundStyle]}>
        <LinearGradient
          colors={gradientColors1}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.View style={[styles.gradientLayer, wave1Style]}>
        <LinearGradient
          colors={gradientColors2}
          style={styles.gradient}
          start={{ x: 0.2, y: 0.3 }}
          end={{ x: 0.8, y: 0.7 }}
        />
      </Animated.View>

      <Animated.View style={[styles.gradientLayer, wave2Style]}>
        <LinearGradient
          colors={gradientColors3}
          style={styles.gradient}
          start={{ x: 0.7, y: 0.1 }}
          end={{ x: 0.3, y: 0.9 }}
        />
      </Animated.View>

      {/* Scanline effect */}
      {scanlineIntensity > 0 && (
        <Animated.View style={[styles.scanline, scanlineStyle]}>
          <LinearGradient
            colors={[
              'transparent',
              `rgba(255, 255, 255, ${scanlineIntensity * 0.1})`,
              'transparent',
            ]}
            style={styles.scanlineGradient}
          />
        </Animated.View>
      )}

      {/* Noise overlay */}
      {noiseIntensity > 0 && (
        <View style={[styles.noiseOverlay, { opacity: noiseIntensity * 0.3 }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
  },
  scanlineGradient: {
    flex: 1,
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    // You could add a noise pattern here using a background image
  },
});

export default DarkVeil;