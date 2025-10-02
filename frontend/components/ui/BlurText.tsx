import React, { useEffect, useRef, useState, useMemo, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface BlurTextProps {
  text?: string;
  delay?: number;
  style?: any;
  animateBy?: 'words' | 'characters';
  direction?: 'top' | 'bottom';
  onAnimationComplete?: () => void;
  stepDuration?: number;
  textStyle?: any;
}

const BlurText: React.FC<BlurTextProps> = memo(({
  text = '',
  delay = 200,
  style,
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  stepDuration = 350,
  textStyle,
}) => {
  const elements = useMemo(() => animateBy === 'words' ? text.split(' ') : text.split(''), [text, animateBy]);
  const [inView, setInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Only animate once when component first mounts
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          setInView(true);
          setHasAnimated(true);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [hasAnimated]);

  const AnimatedWord: React.FC<{
    word: string;
    index: number;
    isLast: boolean;
  }> = ({ word, index, isLast }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(direction === 'top' ? -50 : 50);
    const blur = useSharedValue(10);

    useEffect(() => {
      if (inView) {
        const animationDelay = (index * delay);

        // First stage - slight movement and partial opacity
        opacity.value = withDelay(
          animationDelay,
          withTiming(0.5, {
            duration: stepDuration / 2,
            easing: Easing.out(Easing.quad),
          })
        );

        translateY.value = withDelay(
          animationDelay,
          withTiming(direction === 'top' ? 5 : -5, {
            duration: stepDuration / 2,
            easing: Easing.out(Easing.quad),
          })
        );

        blur.value = withDelay(
          animationDelay,
          withTiming(5, {
            duration: stepDuration / 2,
            easing: Easing.out(Easing.quad),
          })
        );

        // Second stage - final position
        setTimeout(() => {
          opacity.value = withTiming(1, {
            duration: stepDuration / 2,
            easing: Easing.out(Easing.quad),
          });

          translateY.value = withTiming(0, {
            duration: stepDuration / 2,
            easing: Easing.out(Easing.quad),
          });

          blur.value = withTiming(0, {
            duration: stepDuration / 2,
            easing: Easing.out(Easing.quad),
          }, (finished) => {
            if (finished && isLast && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          });
        }, animationDelay + stepDuration / 2);
      }
    }, [inView, index, isLast]);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
      // Note: React Native doesn't support blur filter directly
      // We'll simulate it with opacity transitions
    }));

    return (
      <Animated.View style={[styles.wordContainer, animatedStyle]}>
        <Text style={[styles.word, textStyle]}>
          {word === ' ' ? '\u00A0' : word}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {elements.map((segment, index) => (
        <AnimatedWord
          key={index}
          word={segment}
          index={index}
          isLast={index === elements.length - 1}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    // Individual word container
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default BlurText;

// Add display name for debugging
BlurText.displayName = 'BlurText';