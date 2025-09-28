import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const animatePress = (pressed: boolean) => {
    const animations = [
      Animated.spring(scaleAnim, {
        toValue: pressed ? 0.88 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(translateYAnim, {
        toValue: pressed ? -2 : 0,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ];

    if (props.accessibilityState?.selected) {
      animations.push(
        Animated.spring(glowAnim, {
          toValue: pressed ? 1 : 0.7,
          useNativeDriver: false,
          tension: 300,
          friction: 10,
        })
      );
    }

    Animated.parallel(animations).start();
  };

  React.useEffect(() => {
    if (props.accessibilityState?.selected) {
      Animated.spring(glowAnim, {
        toValue: 0.7,
        useNativeDriver: false,
        tension: 200,
        friction: 8,
      }).start();
    } else {
      Animated.spring(glowAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 200,
        friction: 8,
      }).start();
    }
  }, [props.accessibilityState?.selected]);

  return (
    <View style={styles.container}>
      {/* Active state glow effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowAnim,
            transform: [
              {
                scale: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.1],
                }),
              },
            ],
          },
        ]}
      />
      
      {/* Main pressable area */}
      <Animated.View
        style={[
          styles.pressableContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.tabButton,
            props.accessibilityState?.selected && styles.activeTab,
          ]}
          onTouchStart={() => {
            animatePress(true);
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            props.onPress?.(undefined as any);
          }}
          onTouchEnd={() => animatePress(false)}
          onTouchCancel={() => animatePress(false)}
        >
          <View style={styles.childrenContainer}>
            {props.children}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  pressableContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 49,
    paddingHorizontal: 12,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    minHeight: 40,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  childrenContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});