import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const underlineAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start the animation sequence
        Animated.sequence([
            // Fade in and scale up logo
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {    
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]),
            // Animate underline
            Animated.timing(underlineAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: false,
            }),
            // Hold for a moment
            Animated.delay(800),
            // Fade out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Animation finished, call onFinish
            onFinish();
        });
    }, [fadeAnim, scaleAnim, underlineAnim, onFinish]);

    const underlineWidth = underlineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 80],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Text style={styles.logoText}>Kijo</Text>
                <Animated.View
                    style={[
                        styles.logoUnderline,
                        {
                            width: underlineWidth,
                        },
                    ]}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 2,
        marginBottom: 10,
    },
    logoUnderline: {
        width: 80,
        height: 3,
        backgroundColor: '#007AFF',
        borderRadius: 2,
    },
});